import { CardContentItem, DictionaryNote } from "@/types";
import clsx from "clsx";
import QRCode from "react-qr-code";
import { Separator } from "./ui/separator";

function formatUniqueId(uniqueId: string) {
  if (uniqueId.length <= 12) return uniqueId;

  return `${uniqueId.slice(0, 7)}...${uniqueId.slice(-4)}`;
}

export default function CardContent({
  cardRef,
  fontFamily,
  item,
  transformTCOrSp,
  traditional,
  scale = "normal",
  isQrcode = false,
  category,
}: CardContentItem) {
  const dictionaryContext = (item.note as DictionaryNote).context;
  const structuredBlocks =
    item.structured_note?.data?.flatMap((data) => data.blocks || []) || [];
  const structuredJyutpings = item.structured_note?.data
    ?.map((data) => data.jyutping || data.jytping)
    .filter((jyutping): jyutping is string => Boolean(jyutping));
  const structuredDefinitions = structuredBlocks
    .filter((block) => block.type === "definition" && block.content)
    .map((block) => block.content as string);
  const contextPinyin = dictionaryContext.pinyin;
  const contextMeanings = dictionaryContext.meaning;
  const jyutpings =
    structuredJyutpings?.length && structuredJyutpings.length > 0
      ? structuredJyutpings
      : Array.isArray(contextPinyin)
        ? contextPinyin
        : contextPinyin
          ? [contextPinyin]
          : [];
  const definitions =
    structuredDefinitions.length > 0
      ? structuredDefinitions
      : Array.isArray(contextMeanings)
        ? contextMeanings
        : contextMeanings
          ? [contextMeanings]
          : [];

  return (
    <div
      ref={cardRef}
      className={clsx(
        "flex w-[min(92vw,960px)] max-w-full min-h-[320px] md:min-h-[360px] flex-col p-6 rounded-lg border shadow-[var(--ds-card-shadow)]",
        "border-[var(--ds-border)] bg-[var(--ds-background)] text-[var(--ds-foreground)]",
      )}
    >
      <div className="flex flex-1 flex-col space-y-4">
        <h1
          className={clsx(
            {
              "text-6xl": scale === "normal",
              "text-7xl": scale === "large",
              "text-8xl": scale === "xl",
            },
            `mt-2 font-semibold p-4 leading-tight font-[${fontFamily}]`,
          )}
        >
          {transformTCOrSp(item.data, traditional)}
        </h1>
        <div
          className={clsx(
            {
              "text-xs": scale === "normal",
              "text-base": scale === "large",
              "text-xl": scale === "xl",
            },
            `p-4 pt-0 font-[${fontFamily}] [&>*:not(:last-child)]:mb-3`,
          )}
        >
          {/* 非歌曲粤拼 */}
          {jyutpings.length > 0 && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
              <span>
                {jyutpings
                  .map((jyutping) => transformTCOrSp(jyutping, traditional))
                  .join("、 ")}
              </span>
            </p>
          )}

          {/* 歌曲粤拼 */}
          {dictionaryContext.song_name_pin && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
              <span>{dictionaryContext.song_name_pin}</span>
            </p>
          )}

          {/* 释义 */}
          {definitions.length > 0 && (
            <p className="leading-relaxed">
              <b>
                {transformTCOrSp("釋義", traditional)}：<br />
              </b>{" "}
              <span>
                {definitions.map((definition, idx) => (
                  <span key={`${definition}-${idx}`}>
                    {transformTCOrSp(definition, traditional)}
                    {idx < definitions.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </p>
          )}

          {/* 歌曲歌手 */}
          {dictionaryContext.author && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("歌手", traditional)}：</b>{" "}
              <span>{dictionaryContext.author}</span>
            </p>
          )}

          <Separator className="!my-4 bg-[var(--ds-primary)]" />

          {/* 来源语料集 */}
          {category?.nickname && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("来源语料集", traditional)}：</b>{" "}
              <span>{transformTCOrSp(category.nickname, traditional)}</span>
            </p>
          )}

          {/* 分类 */}
          {category?.tags && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("分类", traditional)}：</b>{" "}
              <span>
                {transformTCOrSp(category.tags.join("/"), traditional)}
              </span>
            </p>
          )}

          {/* 关键标签 */}
          {(item.tags.length > 0 || (item.related_tags?.length ?? 0) > 0) && (
            <div className="flex items-start gap-2 leading-relaxed">
              <b className="shrink-0">
                {transformTCOrSp("关键标签", traditional)}：
              </b>
              <div className="flex flex-wrap gap-2">
                {(item.tags.length > 0
                  ? item.tags
                  : item.related_tags?.length
                    ? item.related_tags
                    : []
                ).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-[var(--ds-primary)] bg-[var(--ds-tag-background)] px-2 py-0.5 text-[0.95em] font-semibold leading-tight text-[var(--ds-tag-foreground)]"
                  >
                    {transformTCOrSp(tag, traditional)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 推荐标签 */}
          {(item.recommended_tags?.length ?? 0) > 0 && (
            <div className="flex items-start gap-2 leading-relaxed">
              <b className="shrink-0">
                {transformTCOrSp("推荐标签", traditional)}：
              </b>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {(item.recommended_tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-[#cfd3d7] bg-[#f1f3f5] px-2 py-0.5 text-[0.95em] font-semibold leading-tight text-[#7a7f85] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-[#2c333d] dark:bg-[#20252c] dark:text-[#b8bdc4] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    {transformTCOrSp(tag, traditional)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 歌曲介绍 */}
          {dictionaryContext.introduction && (
            <p className="leading-relaxed">
              <b>
                {transformTCOrSp("介绍", traditional)}：<br />
              </b>{" "}
              <span>
                {transformTCOrSp(
                  dictionaryContext.introduction + "",
                  traditional,
                )}
              </span>
            </p>
          )}

          {/* 歌曲歌词 */}
          {dictionaryContext.lyric &&
            typeof dictionaryContext.lyric === "string" && (
              <p className="leading-relaxed">
                <b>
                  {transformTCOrSp("歌词", traditional)}：<br />
                </b>{" "}
                <span>
                  {transformTCOrSp(dictionaryContext.lyric + "", traditional)}
                  <br />
                  {dictionaryContext.pron}
                </span>
              </p>
            )}

          {/* {(item.note as DictionaryNote).contributor && (
            <p className="leading-relaxed">
              <b>{transformTCOrSp("貢獻者", traditional)}：</b>{" "}
              <span>{(item.note as DictionaryNote).contributor}</span>
            </p>
          )} */}

          {item.unique_id && (
            <p className="leading-relaxed text-[var(--ds-muted)]">
              <span>Unique ID:</span>{" "}
              <span className="font-light">
                {formatUniqueId(item.unique_id)}
              </span>
            </p>
          )}
        </div>
      </div>
      {isQrcode && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--ds-border)] pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src="/logo.png"
              alt="DimSum"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
            />
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="shrink-0 text-base font-bold text-[var(--ds-foreground)]">
                DimSum
              </span>
            </div>
          </div>
          <div className="shrink-0 rounded-sm bg-white p-0.5">
            <QRCode
              value="https://search.aidimsum.com"
              size={44}
              bgColor="white"
              fgColor="black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
