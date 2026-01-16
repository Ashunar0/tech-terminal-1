"use client";

import { useState, useEffect } from "react";
import { Article, ArticleInput, Course } from "@/types/article";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus } from "lucide-react";

interface ArticleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ArticleInput) => Promise<void>;
  initialData?: Article;
  mode: "create" | "edit";
}

interface OgpResponse {
  success: boolean;
  data: {
    title: string | null;
    thumbnailUrl: string | null;
    description: string | null;
  } | null;
}

export function ArticleForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ArticleFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [course, setCourse] = useState<Course>("web");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [memo, setMemo] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOgp, setIsFetchingOgp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form with data (for edit mode)
  useEffect(() => {
    if (initialData && mode === "edit") {
      setUrl(initialData.url);
      setTitle(initialData.title);
      setThumbnailUrl(initialData.thumbnailUrl);
      setCourse(initialData.course);
      setTags(initialData.tags);
      setMemo(initialData.memo);
      setAuthor(initialData.author);
    } else {
      // Reset form for create mode
      setUrl("");
      setTitle("");
      setThumbnailUrl(null);
      setCourse("web");
      setTags([]);
      setTagInput("");
      setMemo("");
      setAuthor("");
      setErrors({});
      setSubmitError(null);
    }
  }, [initialData, mode, open]);

  // Fetch OGP data with debounce (500ms)
  useEffect(() => {
    if (!url || mode === "edit") return;

    const timer = setTimeout(async () => {
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        return;
      }

      setIsFetchingOgp(true);
      try {
        const response = await fetch(
          `/api/ogp?url=${encodeURIComponent(url)}`
        );
        const data: OgpResponse = await response.json();

        if (data.success && data.data) {
          if (data.data.title && !title) {
            setTitle(data.data.title);
          }
          if (data.data.thumbnailUrl) {
            setThumbnailUrl(data.data.thumbnailUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch OGP:", error);
      } finally {
        setIsFetchingOgp(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [url, mode, title]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!url.trim()) {
      newErrors.url = "URLは必須です";
    } else {
      try {
        new URL(url);
      } catch {
        newErrors.url = "有効なURLを入力してください";
      }
    }

    if (!title.trim()) {
      newErrors.title = "タイトルは必須です";
    }

    if (!author.trim()) {
      newErrors.author = "投稿者名は必須です";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setSubmitError(null);
    try {
      await onSubmit({
        url: url.trim(),
        title: title.trim(),
        thumbnailUrl,
        course,
        tags,
        memo: memo.trim(),
        author: author.trim(),
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "記事の保存に失敗しました。Firebaseの設定を確認してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "create" ? "記事を追加" : "記事を編集"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              URL <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={errors.url ? "border-destructive" : ""}
              />
              {isFetchingOgp && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              タイトル <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="記事のタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Course Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              コース <span className="text-destructive">*</span>
            </label>
            <Select value={course} onValueChange={(v) => setCourse(v as Course)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="gameapp">GameApp</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">タグ</label>
            <div className="flex gap-2">
              <Input
                placeholder="タグを入力してEnter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Memo Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">メモ</label>
            <Textarea
              placeholder="記事についてのメモや補足情報"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
            />
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              投稿者名 <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="あなたの名前"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={errors.author ? "border-destructive" : ""}
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author}</p>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "追加" : "更新"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
