"use client";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Article, ArticleInput } from "@/types/article";
import { timestampToDate } from "@/types/article";

const COLLECTION_NAME = "articles";

/**
 * 記事一覧を取得（作成日時の降順）
 */
export async function getArticles(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, COLLECTION_NAME);
    const q = query(articlesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        url: data.url,
        title: data.title,
        thumbnailUrl: data.thumbnailUrl,
        course: data.course,
        tags: data.tags || [],
        memo: data.memo || "",
        author: data.author,
        createdAt: timestampToDate(data.createdAt as Timestamp),
        updatedAt: timestampToDate(data.updatedAt as Timestamp),
      };
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

/**
 * 個別記事を取得
 */
export async function getArticle(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      url: data.url,
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
      course: data.course,
      tags: data.tags || [],
      memo: data.memo || "",
      author: data.author,
      createdAt: timestampToDate(data.createdAt as Timestamp),
      updatedAt: timestampToDate(data.updatedAt as Timestamp),
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

/**
 * 記事を追加
 */
export async function addArticle(data: ArticleInput): Promise<string> {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
}

/**
 * 記事を更新
 */
export async function updateArticle(
  id: string,
  data: Partial<ArticleInput>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

/**
 * 記事を削除
 */
export async function deleteArticle(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}
