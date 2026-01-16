import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export interface OgpResponse {
  success: boolean;
  data: {
    title: string | null;
    thumbnailUrl: string | null;
    description: string | null;
  } | null;
}

/**
 * URL のバリデーション
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * OGP 取得 API エンドポイント
 * GET /api/ogp?url=<encoded-url>
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    // URL パラメータの存在確認
    if (!url) {
      return NextResponse.json<OgpResponse>(
        {
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // URL バリデーション
    if (!isValidUrl(url)) {
      return NextResponse.json<OgpResponse>(
        {
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // OGP 取得（タイムアウト: 5秒）
    const { result, error } = await ogs({
      url,
      timeout: 5000,
    });

    if (error || !result.success) {
      // エラー時は空データを返す
      return NextResponse.json<OgpResponse>({
        success: false,
        data: {
          title: null,
          thumbnailUrl: null,
          description: null,
        },
      });
    }

    // OGP データを返却
    const ogImage = result.ogImage;
    let thumbnailUrl: string | null = null;

    if (Array.isArray(ogImage) && ogImage.length > 0) {
      thumbnailUrl = ogImage[0].url || null;
    } else if (
      ogImage &&
      typeof ogImage === "object" &&
      "url" in ogImage &&
      typeof ogImage.url === "string"
    ) {
      thumbnailUrl = ogImage.url;
    }

    return NextResponse.json<OgpResponse>({
      success: true,
      data: {
        title: result.ogTitle || null,
        thumbnailUrl,
        description: result.ogDescription || null,
      },
    });
  } catch (error) {
    console.error("OGP fetch error:", error);
    // エラー時は空データを返す
    return NextResponse.json<OgpResponse>({
      success: false,
      data: {
        title: null,
        thumbnailUrl: null,
        description: null,
      },
    });
  }
}
