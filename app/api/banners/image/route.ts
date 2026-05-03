import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set([
  "web-static.hg-cdn.com",
  "endfield.gryphline.com",
  "www.endfield.gryphline.com",
]);

const IMAGE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  Referer: "https://endfield.gryphline.com/ko-kr/news",
};

function isAllowedUrl(url: URL) {
  return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url", { status: 400 });
  }

  let imageUrl: URL;

  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!isAllowedUrl(imageUrl)) {
    return new NextResponse("Blocked image host", { status: 403 });
  }

  try {
    const response = await fetch(imageUrl.toString(), {
      cache: "no-store",
      headers: IMAGE_HEADERS,
    });

    if (!response.ok) {
      return new NextResponse(`Image fetch failed: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType.startsWith("image/")
          ? contentType
          : "image/jpeg",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse("Image proxy error", { status: 500 });
  }
}