import { Timestamp } from "firebase/firestore";

/**
 * Course type - コース区分
 */
export type Course = "python" | "web" | "gameapp" | "other";

/**
 * Article type - Firestore から取得した記事データ
 */
export interface Article {
  id: string;
  url: string;
  title: string;
  thumbnailUrl: string | null;
  course: Course;
  tags: string[];
  memo: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ArticleInput type - 記事登録・更新時の入力データ
 */
export interface ArticleInput {
  url: string;
  title: string;
  thumbnailUrl: string | null;
  course: Course;
  tags: string[];
  memo: string;
  author: string;
}

/**
 * Firestore Timestamp を Date に変換
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Date を Firestore Timestamp に変換
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}
