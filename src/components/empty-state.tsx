"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Plus } from "lucide-react";

interface EmptyStateProps {
  type: "no-articles" | "no-results";
  onAddArticle?: () => void;
}

export function EmptyState({ type, onAddArticle }: EmptyStateProps) {
  if (type === "no-articles") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">記事がありません</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            最初の技術記事を追加して、ナレッジベースを構築しましょう。
          </p>
          {onAddArticle && (
            <Button onClick={onAddArticle} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              記事を追加
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          該当する記事が見つかりません
        </h3>
        <p className="text-muted-foreground max-w-sm">
          検索条件やフィルターを変更して、もう一度お試しください。
        </p>
      </CardContent>
    </Card>
  );
}
