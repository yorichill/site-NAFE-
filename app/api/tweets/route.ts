import { NextResponse } from "next/server";

const CORS  = { "Access-Control-Allow-Origin": "*" };
const USER  = process.env.TWITTER_USER || "NafeOfficiel";
const URL   = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${USER}`;
const RE    = /id="__NEXT_DATA__"[^>]*>(.+?)<\/script>/;

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: { like_count: number; retweet_count: number };
  media?: { url: string; type: string }[];
  pinned?: boolean;
}

const FALLBACK_TWEETS: Tweet[] = [
  {
    "id": "2098488608801935761",
    "text": "LE ROSTER ARRIVE.\n\nDemain, NAFE dévoile officiellement sa line-up Valorant.\n\n@BoostahVLR • @KyMeVLR • @Yeezerr • @Piou888 • @GlassySkyvlr \n\nUne nouvelle page s’ouvre.\nLe travail commence maintenant.\n\nLe phœnix ne meurt jamais. 🩵🤍\n\n#NAFE #Valorant #Esport #RosterAnnounce",
    "created_at": "2026-09-11T19:07:27.000Z",
    "pinned": true,
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HR9UQ2zWsAUFkGo?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2099222410150949257",
    "text": "@Twigzfn est qual top 4000 !!! \nRetrouvez le sur https://twitch.tv/nafetv à 22 h",
    "created_at": "2026-09-13T19:43:18.000Z",
    "public_metrics": {
      "like_count": 11,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2099216140211822679",
    "text": "@Rezpaaan qual top 4000 🤺\n22h on https://twitch.tv/nafetv",
    "created_at": "2026-09-13T19:18:24.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098784287843590387",
    "text": "SPIKE TOUR — RESULTS\n\nNAFE continue son parcours sur le Spike Tour.\n\nMatch 3 : NAFE 5-13 @Brezelit \nMatch 4 : NAFE 13-5 #SBR\n\nAprès un match compliqué, l’équipe a su réagir avec une victoire solide sur le quatrième match.\n\nLe phœnix ne meurt jamais. 🩵🤍\n\n#NAFE #Valorant #SpikeTour #Esport #NAFEWIN",
    "created_at": "2026-09-12T14:42:22.000Z",
    "public_metrics": {
      "like_count": 15,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSBhLzDXAAg2eOM?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098746389786145143",
    "text": "SPIKE TOUR — RESULTS\n\nDéfaite pour NAFE sur cette rencontre face aux Zinzins de l’Espace et Tapis Volant.\n\nMatch 1 : NAFE 4-13 Les Zinzins de l’Espace\nMatch 2 : NAFE 11-13 Tapis Volant\n\nUn premier match compliqué, mais une vraie réaction sur la deuxième map avec un score beaucoup plus serré.\n\nLe phœnix ne meurt jamais. 🩵🤍\n\n#NAFE #Valorant #SpikeTour #Esport #NAFEWIN",
    "created_at": "2026-09-12T12:11:46.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSA-tzsWQAUKck2?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098738354363801644",
    "text": "Après ce premier match nous voici contre les #tapisvolant pour cette deuxième manche du #spiketour !! \nOn croit en vous #nafewin 🩵🤍",
    "created_at": "2026-09-12T11:39:51.000Z",
    "public_metrics": {
      "like_count": 16,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSA3aIUbQAAqL1K?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098700841964151061",
    "text": "Pour débuter cette journée de spike tour   NAFE va jouer contre #leszinzindelespace a 12h . \nOn vous attends nombreux sur la chaîne pour les supporter toute la journée . \nhttps://twitch.tv/nafetv",
    "created_at": "2026-09-12T09:10:47.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 4
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSAVSJvXIAEVzgV?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096575094654910466",
    "text": "@vexskifn réalise une belle semaine avec de bons résultats sous les couleurs de NAFE. 🩵🤍\n\nÀ retenir :\n\nTop 130 EU en FNCS Division 1 Practice\nTop 9743 en Reload Victory Cup\nTop 573 en Fortnite Performance Evaluation\n\nUne semaine de plus pour progresser et continuer à représenter l’équipe.\nLe phœnix ne meurt jamais. 🪽\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T12:23:49.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRiH7shbQAAuyOA?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096554929477255549",
    "text": "@KsawiiFN poursuit sa progression avec une semaine encourageante sous le tag NAFE. 🩵🤍\n\nCette semaine :\n\nTop 326 EU en FNCS Division 2 Practice\nTop 508 en Fortnite Performance Evaluation\nTop 7069 en Solo Victory Cup\n\nLe chemin continue, et le travail paie petit à petit.\nLe phœnix ne meurt jamais. 🪽\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T11:03:41.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRh1mBhXQAAku4J?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096539231766114515",
    "text": "@Twigzfn continue d’avancer avec une semaine solide sous les couleurs de NAFE. 🩵🤍\n\nSes résultats cette semaine :\n\nTop 550 EU en FNCS Division 1 Practice\nTop 937 en Reload Duos Victory Cup\nTop 188 en Fortnite Performance Evaluation\nQualifié en Solo Victory Cup\n\nDe la régularité, de l’envie et une vraie progression.\nLe phœnix ne meurt jamais. 🪽\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T10:01:19.000Z",
    "public_metrics": {
      "like_count": 9,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRhnUV3W4AEKppA?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096524086805426196",
    "text": "@Rezpaaan signe une très belle première semaine sous les couleurs de NAFE. 🩵🤍\n\nParmi ses résultats :\n\nTop 42 EU en FNCS Division 1 Practice\nTop 846 en Reload Victory Cup\nTop 919 en Fortnite Performance Evaluation\nTop 7300 en Solo Victory Cup\n\nLe travail continue et la progression est là.\nLe phœnix ne meurt jamais. 🪽\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T09:01:08.000Z",
    "public_metrics": {
      "like_count": 15,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRhZir1W4AMUsBW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096340852524335455",
    "text": "NAFE WEEKLY RECAP 🩵🤍\n\nCette semaine, nos joueurs Fortnite ont porté les couleurs de NAFE sur plusieurs cups compétitives.\n\nLes performances arrivent, le travail continue, et chaque résultat nous rapproche de nos objectifs.\n\n📅 Rendez-vous demain pour découvrir les récapitulatifs individuels de nos joueurs.\n\nLe phœnix ne meurt jamais. 🪽\n#nafeWIN #nafe #Fortnite #Esport #FNCS #FortniteCompetitive",
    "created_at": "2026-09-05T20:53:02.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRey5JtXMAQkNPk?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096266371432681694",
    "text": "Top 11 pour @Twigzfn 💪😔\nSi proche du but !! \n\nLast game NOW on https://twitch.tv/nafetv\n\nWe’re proud of you !!!",
    "created_at": "2026-09-05T15:57:04.000Z",
    "public_metrics": {
      "like_count": 10,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096262665563750530",
    "text": "1 ère game pour @Twigzfn TOP 29 \nKeep pushing 🤺",
    "created_at": "2026-09-05T15:42:20.000Z",
    "public_metrics": {
      "like_count": 8,
      "retweet_count": 1
    }
  },
  {
    "id": "2096252945364901896",
    "text": "@Twigzfn doit gagner pour repartir avec du cashprize. \nMake us proud 🤺\n\nEn live ici https://twitch.tv/nafetv",
    "created_at": "2026-09-05T15:03:43.000Z",
    "public_metrics": {
      "like_count": 7,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRdi8Q9XwAUBsY2?format=webp&name=medium",
        "type": "photo"
      }
    ]
  }
];

const g = global as typeof globalThis & { _tweetCache?: { tweets: Tweet[]; at: number } };
const TTL = 5 * 60 * 1000;

function parse(html: string): Tweet[] {
  const m = html.match(RE);
  if (!m) return [];
  try {
    const data    = JSON.parse(m[1]);
    const entries = (data?.props?.pageProps?.timeline?.entries ?? []) as {
      type: string;
      content: { tweet: any };
    }[];
    return entries
      .filter(e => e.type === "tweet" || (e as any).entryType === "pinned")
      .slice(0, 15)
      .map((e, idx) => {
        const t = e.content.tweet;
        const isPinned = idx === 0 && (Boolean((e as any).entryType === "pinned" || (t as any)?.is_pinned || (t as any)?.pinned));
        const media = (t.extended_entities?.media || t.entities?.media || []).map((m: any) => ({
          url: m.media_url_https || m.media_url,
          type: m.type
        }));

        return {
          id:         String(t.id_str ?? ""),
          text:       String(t.full_text ?? t.text ?? ""),
          created_at: new Date(String(t.created_at ?? "")).toISOString(),
          public_metrics: {
            like_count:    Number(t.favorite_count ?? 0),
            retweet_count: Number(t.retweet_count  ?? 0),
          },
          media: media.length > 0 ? media : undefined,
          pinned: isPinned || undefined
        };
      });
  } catch (err) {
    console.error("[TweetsAPI] Parse error:", err);
    return [];
  }
}

export async function GET() {
  console.log(`[TweetsAPI] Fetching for ${USER}...`);
  try {
    if (g._tweetCache && Date.now() - g._tweetCache.at < TTL) {
      return NextResponse.json({ tweets: g._tweetCache.tweets }, { headers: CORS });
    }
    
    let tweets: Tweet[] = [];
    try {
      const response = await fetch(URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Dest": "document",
          "Referer": "https://twitter.com/"
        },
        next: { revalidate: 300 }
      });

      const html = await response.text();
      tweets = html ? parse(html) : [];
    } catch (fetchErr) {
      console.warn("[TweetsAPI] Live fetch failed:", fetchErr);
    }
    
    if (tweets.length === 0) {
      tweets = FALLBACK_TWEETS;
    }

    g._tweetCache = { tweets, at: Date.now() };
    return NextResponse.json({ tweets }, { headers: CORS });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[TweetsAPI] Error:", msg);
    return NextResponse.json({ error: msg, tweets: FALLBACK_TWEETS }, { status: 200, headers: CORS });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: { ...CORS, "Access-Control-Allow-Methods": "GET" } });
}
