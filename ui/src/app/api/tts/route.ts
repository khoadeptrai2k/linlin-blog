import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function sources(text: string, lang: string) {
  const q = encodeURIComponent(text);
  const prefix = lang.slice(0, 2).toLowerCase();
  const urls: string[] = [];
  if (prefix === "zh") {
    urls.push(`https://dict.youdao.com/dictvoice?le=zh&audio=${q}`);
  }
  if (prefix === "en") {
    urls.push(`https://dict.youdao.com/dictvoice?le=en&audio=${q}`);
    urls.push(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${q}`);
  }
  urls.push(`https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${encodeURIComponent(lang)}&q=${q}`);
  urls.push(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${q}`);
  return urls;
}

export async function GET(request: NextRequest) {
  const text = (request.nextUrl.searchParams.get("q") || "").trim();
  const lang = (request.nextUrl.searchParams.get("lang") || "en-US").trim();
  if (!text || text.length > 200) {
    return new Response("INVALID_TEXT", { status: 400 });
  }

  for (const url of sources(text, lang)) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0",
          accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
        },
        cache: "no-store",
        redirect: "follow",
      });
      if (!response.ok) continue;
      const body = await response.arrayBuffer();
      if (body.byteLength < 80) continue;
      const type = response.headers.get("content-type") || "";
      if (type.includes("json") || type.includes("html") || type.includes("text/")) continue;
      return new Response(body, {
        headers: {
          "content-type": type.includes("audio") ? type : "audio/mpeg",
          "cache-control": "public, max-age=86400",
        },
      });
    } catch {
      continue;
    }
  }

  return new Response("TTS_UNAVAILABLE", { status: 502 });
}
