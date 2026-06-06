import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXACT_HOSTS = new Set([
  "web-static.hg-cdn.com",
  "endfield.gryphline.com",
  "www.endfield.gryphline.com",
]);

const ALLOWED_SUFFIXES = [".hg-cdn.com", ".gryphline.com"];

const IMAGE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  Referer: "https://endfield.gryphline.com/ko-kr/news",
};
const UPSTREAM_CACHE_SECONDS = 24 * 60 * 60;
const STALE_WHILE_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

function isAllowedUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();

  return (
    url.protocol === "https:" &&
    (ALLOWED_EXACT_HOSTS.has(hostname) ||
      ALLOWED_SUFFIXES.some((suffix) => hostname.endsWith(suffix)))
  );
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("이미지 주소가 없습니다.", { status: 400 });
  }

  let imageUrl: URL;

  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return new NextResponse("올바르지 않은 이미지 주소입니다.", { status: 400 });
  }

  if (!isAllowedUrl(imageUrl)) {
    return new NextResponse("허용되지 않은 이미지 주소입니다.", { status: 403 });
  }

  try {
    const response = await fetch(imageUrl.toString(), {
      headers: IMAGE_HEADERS,
      next: { revalidate: UPSTREAM_CACHE_SECONDS },
    });

    if (!response.ok) {
      return new NextResponse(`이미지를 불러오지 못했습니다. 상태 코드: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return new NextResponse("이미지 형식이 올바르지 않습니다.", { status: 415 });
    }

    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=3600, s-maxage=${UPSTREAM_CACHE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
      },
    });
  } catch {
    return new NextResponse("이미지 프록시 처리 중 오류가 발생했습니다.", { status: 500 });
  }
}
