import { NextResponse } from "next/server";
import { execFileSync } from "child_process";

const CORS  = { "Access-Control-Allow-Origin": "*" };
const USER  = process.env.TWITTER_USER || "NafeOfficiel";
const URL   = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${USER}`;
const RE    = /id="__NEXT_DATA__"[^>]*>(.+?)<\/script>/;

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: { like_count: number; retweet_count: number };
}

const g = global as typeof globalThis & { _tweetCache?: { tweets: Tweet[]; at: number } };
const TTL = 5 * 60 * 1000;

function fetchWithCurl(): string {
  return execFileSync("curl", [
    "-s", "--max-time", "8",
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "-H", "Referer: https://twitter.com/",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    URL,
  ], { encoding: "utf8", timeout: 10000 });
}

function parse(html: string): Tweet[] {
  const m = html.match(RE);
  if (!m) return [];
  const data    = JSON.parse(m[1]);
  const entries = (data?.props?.pageProps?.timeline?.entries ?? []) as {
    type: string;
    content: { tweet: Record<string, unknown> };
  }[];
  return entries
    .filter(e => e.type === "tweet")
    .slice(0, 5)
    .map(e => {
      const t = e.content.tweet;
      return {
        id:         String(t.id_str ?? ""),
        text:       String(t.full_text ?? t.text ?? ""),
        created_at: new Date(String(t.created_at ?? "")).toISOString(),
        public_metrics: {
          like_count:    Number(t.favorite_count ?? 0),
          retweet_count: Number(t.retweet_count  ?? 0),
        },
      };
    });
}

export async function GET() {
  try {
    if (g._tweetCache && Date.now() - g._tweetCache.at < TTL) {
      return NextResponse.json({ tweets: g._tweetCache.tweets }, { headers: CORS });
    }
    const html   = fetchWithCurl();
    const tweets = parse(html);
    g._tweetCache = { tweets, at: Date.now() };
    return NextResponse.json({ tweets }, { headers: CORS });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, tweets: [] }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: { ...CORS, "Access-Control-Allow-Methods": "GET" } });
}
