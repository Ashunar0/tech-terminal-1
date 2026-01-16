"use client";

import { useEffect, useState, useMemo } from "react";
import { Article, ArticleInput, Course } from "@/types/article";
import {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} from "@/services/article-service";
import { ArticleCard } from "@/components/article-card";
import { SearchBar } from "@/components/search-bar";
import { FilterBar } from "@/components/filter-bar";
import { ArticleForm } from "@/components/article-form";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  // Data state
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);

  // Load articles on mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError("記事の読み込みに失敗しました。再試行してください。");
    } finally {
      setIsLoading(false);
    }
  };

  // Get all available tags from articles
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Course filter
      if (selectedCourse !== "all" && article.course !== selectedCourse) {
        return false;
      }

      // Tag filter (AND condition)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) =>
          article.tags.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      // Search query (title and tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesTags = article.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesTags) return false;
      }

      return true;
    });
  }, [articles, selectedCourse, selectedTags, searchQuery]);

  // Handlers
  const handleAddArticle = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDeleteArticle = (article: Article) => {
    setDeletingArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: ArticleInput) => {
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, data);
      } else {
        await addArticle(data);
      }
      await loadArticles();
      setIsFormOpen(false);
      setEditingArticle(null);
    } catch (err) {
      console.error("Failed to save article:", err);
      throw err;
    }
  };

  const handleDeleteConfirm = async (article: Article) => {
    try {
      await deleteArticle(article.id);
      await loadArticles();
      setIsDeleteDialogOpen(false);
      setDeletingArticle(null);
    } catch (err) {
      console.error("Failed to delete article:", err);
      throw err;
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="max-w-7xl mx-auto border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Tech Terminal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                技術記事ナレッジベース
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleAddArticle} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                記事を追加
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="記事を検索（タイトル・タグ）"
          />
          <FilterBar
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadArticles}
              className="mt-3"
            >
              再試行
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingState count={6} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && articles.length === 0 && (
          <EmptyState type="no-articles" onAddArticle={handleAddArticle} />
        )}

        {/* No Results State */}
        {!isLoading &&
          !error &&
          articles.length > 0 &&
          filteredArticles.length === 0 && <EmptyState type="no-results" />}

        {/* Articles Grid */}
        {!isLoading && !error && filteredArticles.length > 0 && (
          <div>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredArticles.length} 件の記事
              {filteredArticles.length !== articles.length &&
                ` （全 ${articles.length} 件中）`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ArticleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingArticle || undefined}
        mode={editingArticle ? "edit" : "create"}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        article={deletingArticle}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
