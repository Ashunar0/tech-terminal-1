"use client";

import { Article, Course } from "@/types/article";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

const courseConfig: Record<
  Course,
  { label: string; color: string; bgColor: string }
> = {
  python: {
    label: "Python",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
  },
  web: {
    label: "Web",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor:
      "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
  },
  gameapp: {
    label: "GameApp",
    color: "text-purple-700 dark:text-purple-400",
    bgColor:
      "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900",
  },
  other: {
    label: "Other",
    color: "text-amber-700 dark:text-amber-400",
    bgColor:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
  },
};

export function ArticleCard({ article, onEdit, onDelete }: ArticleCardProps) {
  const config = courseConfig[article.course];

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        {/* Thumbnail */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-video bg-muted overflow-hidden"
        >
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              article.thumbnailUrl ? "hidden" : ""
            }`}
            style={{ display: article.thumbnailUrl ? "none" : "flex" }}
          >
            <FileText className="w-16 h-16 text-muted-foreground/20" />
          </div>

          {/* Overlay with external link icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </a>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              onEdit(article);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-black/90 dark:hover:bg-black shadow-lg text-destructive hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onDelete(article);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {/* Course badge */}
        <div>
          <Badge
            variant="outline"
            className={`${config.bgColor} ${config.color} font-medium border`}
          >
            {config.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-snug line-clamp-2 tracking-tight">
          {article.title}
        </h3>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Memo */}
        {article.memo && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.memo}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="font-medium">{article.author}</span>
          <time>
            {format(article.createdAt, "yyyy/MM/dd", { locale: ja })}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
