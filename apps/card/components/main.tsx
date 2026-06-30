"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import YueCard from "@/components/card";
import { CardMode, CorpusCategory, CorpusItem } from "../types";

const backendBaseUrl = (
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://backend.aidimsum.com"
).replace(/\/$/, "");
const backendApiUrl = (
  process.env.NEXT_PUBLIC_BACKEND_API_URL || backendBaseUrl
).replace(/\/$/, "");

type EntryTag = {
  id: number;
  slug: string;
  name: string;
};

type EntryCategory = {
  id: number;
  slug: string;
  name: string;
};

type EntryDetail = {
  corpusId: number;
  entryId: string;
  entryName: string;
  jyutping: string | null;
  meaning: string | null;
  source: {
    categoryName: string;
    categoryDisplayName: string | null;
    contributorIds: string[];
  };
  category: {
    primary: EntryCategory | null;
    secondary: EntryCategory | null;
  };
  tags: {
    precise: EntryTag[];
    related: EntryTag[];
    recommended: EntryTag[];
  };
};

type EntryDetailResponse = {
  entry: EntryDetail;
};

function mapEntryToCardData(entry: EntryDetail): {
  item: CorpusItem;
  category: CorpusCategory;
} {
  const categoryTags = [
    entry.category.primary?.name,
    entry.category.secondary?.name,
  ].filter((tag): tag is string => Boolean(tag));

  return {
    item: {
      id: String(entry.corpusId),
      unique_id: entry.entryId,
      data: entry.entryName,
      category: entry.source.categoryName,
      note: {
        context: {
          ...(entry.jyutping ? { pinyin: [entry.jyutping] } : {}),
          ...(entry.meaning ? { meaning: [entry.meaning] } : {}),
        },
        contributor: entry.source.contributorIds.join(", "),
      },
      tags: [],
      related_tags: entry.tags.related.map((tag) => tag.name),
      recommended_tags: entry.tags.recommended.map((tag) => tag.name),
    },
    category: {
      id: entry.source.categoryName,
      name: entry.source.categoryName,
      nickname: entry.source.categoryDisplayName || entry.source.categoryName,
      tags: categoryTags,
    },
  };
}

// Create a client component for the main content
export default function Main() {
  const searchParams = useSearchParams();
  const [item, setItem] = useState<CorpusItem | null>(null);
  const [category, setCategory] = useState<CorpusCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const lastRequestKey = useRef<string | null>(null);
  const requestKey = searchParams.toString();
  const mode: CardMode = searchParams.get("mode") === "dark" ? "dark" : "light";
  const themeClass = mode === "dark" ? "theme-dark" : "theme-light";

  useEffect(() => {
    if (lastRequestKey.current === requestKey) {
      return;
    }

    lastRequestKey.current = requestKey;

    const uniqueId = searchParams.get("uuid");

    const data = searchParams.get("data") || "";
    const pinyin = searchParams.get("pinyin") || null;
    const meaning = searchParams.get("meaning") || null;
    const contributor = searchParams.get("contri") || "";

    const author = searchParams.get("author") || "";
    const lyric = searchParams.get("lyric") || "";
    const pron = searchParams.get("pron") || "";

    async function fetchRandomItem() {
      const response = await fetch(
        `${backendBaseUrl}/random_item?corpus_name=zyzdv2`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch random item");
      }

      const data = await response.json();
      return data;
    }

    async function fetchCorpusCategory(category: string) {
      const response = await fetch(
        `${backendBaseUrl}/v2/corpus_category?name=${encodeURIComponent(
          category,
        )}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      return response.json();
    }

    async function setItemWithCategory(item: CorpusItem) {
      setItem(item);

      if (!item.category) {
        return;
      }

      try {
        const category = await fetchCorpusCategory(item.category);
        setCategory(category);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }

    const fetchData = async () => {
      setLoading(true);
      setItem(null);
      setCategory(null);

      const hasUrlItemParams =
        data || pinyin || meaning || contributor || author || lyric || pron;

      try {
        if (uniqueId) {
          const response = await fetch(
            `${backendApiUrl}/api/entries/${encodeURIComponent(uniqueId)}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = (await response.json()) as EntryDetailResponse;
          const cardData = mapEntryToCardData(data.entry);
          setItem(cardData.item);
          setCategory(cardData.category);
          return;
        }

        if (!hasUrlItemParams) {
          const data = await fetchRandomItem();
          await setItemWithCategory(data);
          return;
        }

        await setItemWithCategory({
          id: Math.random() + "",
          unique_id: Math.random() + "",
          data,
          category: "from url search params",
          note: {
            context: {
              author,
              lyric,
              pron,
              ...(pinyin ? { pinyin: [pinyin] } : {}),
              ...(meaning ? { meaning: [meaning] } : {}),
            },
            contributor,
          },
          tags: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestKey, searchParams]);

  if (loading) {
    return (
      <div
        className={`${themeClass} flex h-screen items-center justify-center bg-[var(--ds-background)] text-[var(--ds-foreground)]`}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--ds-primary)]"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className={`${themeClass} flex h-screen items-center justify-center bg-[var(--ds-background)] text-[var(--ds-foreground)]`}
      >
        <p className="text-[var(--ds-muted)]">No data found</p>
      </div>
    );
  }

  return (
    <div
      className={`${themeClass} min-h-screen bg-[var(--ds-background)] text-[var(--ds-foreground)]`}
    >
      <div className="container mx-auto p-6">
        <center>
          <h1 className="mb-8 text-4xl font-bold">粵語知識分享</h1>
        </center>

        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
            {item && <YueCard item={item} category={category} />}
          </div>
        </div>
      </div>
    </div>
  );
}
