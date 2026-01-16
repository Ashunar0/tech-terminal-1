"use client";

import { Course } from "@/types/article";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterBarProps {
  selectedCourse: Course | "all";
  onCourseChange: (course: Course | "all") => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const courseLabels: Record<Course | "all", string> = {
  all: "全て",
  python: "Python",
  web: "Web",
  gameapp: "GameApp",
  other: "Other",
};

export function FilterBar({
  selectedCourse,
  onCourseChange,
  availableTags,
  selectedTags,
  onTagToggle,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Course filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>コース</span>
        </div>
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{courseLabels.all}</SelectItem>
            <SelectItem value="python">{courseLabels.python}</SelectItem>
            <SelectItem value="web">{courseLabels.web}</SelectItem>
            <SelectItem value="gameapp">{courseLabels.gameapp}</SelectItem>
            <SelectItem value="other">{courseLabels.other}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tag filter */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">タグ</div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? "shadow-sm"
                      : "hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters indicator */}
      {(selectedCourse !== "all" || selectedTags.length > 0) && (
        <div className="text-xs text-muted-foreground pt-1">
          {selectedCourse !== "all" && `${courseLabels[selectedCourse]} `}
          {selectedTags.length > 0 && `・ ${selectedTags.length}個のタグ`}
          で絞り込み中
        </div>
      )}
    </div>
  );
}
