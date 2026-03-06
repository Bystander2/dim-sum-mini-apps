import { CardContentItem, DictionaryNote } from "@/types";
import clsx from "clsx";
import QRCode from "react-qr-code";
import { Separator } from "./ui/separator";

export default function CardContent({
  cardRef,
  bg,
  fontColor,
  fontFamily,
  item,
  transformTCOrSp,
  traditional,
  scale = "normal",
  isQrcode = false,
}: CardContentItem) {
  const qrCodeColor = document
    ?.getElementById("select-bg-color")
    ?.querySelector("*")
    ? window.getComputedStyle(
        document
          ?.getElementById("select-bg-color")
          ?.querySelector("*") as Element
      ).backgroundColor
    : "black";
  return (
    <div
      ref={cardRef}
      className={`p-6 shadow-md rounded-lg border border-[#e5e7eb] ${bg} `}
    >
      <div className="space-y-6">
        {isQrcode && (
          <div className="flex justify-end">
            <QRCode
              value="https://search.aidimsum.com"
              size={64}
              bgColor={qrCodeColor}
              fgColor="white"
            />
          </div>
        )}
        <div className="prose max-w-none">
          <h1
            className={clsx(
              {
                "text-6xl": scale === "normal",
                "text-7xl": scale === "large",
                "text-8xl": scale === "xl",
              },
              {
                "mt-16": isQrcode,
                "mt-4": !isQrcode,
              },
              `font-semibold mb-4 p-4 font-[${fontFamily}] ${fontColor}`
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
              `mt-2 ${fontColor} space-y-4 p-4 font-[${fontFamily}]`
            )}
          >
            {(item.note as DictionaryNote).context.pinyin && (
              <p className="leading-relaxed">
                <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
                <span className={fontColor}>
                  {Array.isArray((item.note as DictionaryNote).context.pinyin)
                    ? (item.note as DictionaryNote)?.context?.pinyin?.join(
                        "、 "
                      )
                    : (item.note as DictionaryNote).context.pinyin}
                </span>
              </p>
            )}
            {(item.note as DictionaryNote).context.song_name_pin && (
              <p className="leading-relaxed">
                <b>{transformTCOrSp("粵拼", traditional)}：</b>{" "}
                <span className={fontColor}>
                  {(item.note as DictionaryNote).context.song_name_pin}
                </span>
              </p>
            )}

            {/* for yyqk corpus */}
            {(item.note as DictionaryNote).context.author && (
              <p className="leading-relaxed">
                <b>{transformTCOrSp("歌手", traditional)}：</b>{" "}
                <span className={fontColor}>
                  {(item.note as DictionaryNote).context.author}
                </span>
              </p>
            )}
            <Separator className={`my-4 bg-current`} />
          </div>
        </div>

        <div
          className={clsx(
            {
              "text-xs": scale === "normal",
              "text-base": scale === "large",
              "text-xl": scale === "xl",
            },
            `mt-2 text-[#4b5563] space-y-4 font-[${fontFamily}]`
          )}
        >
          <div className="p-4 space-y-2">
            {(item.note as DictionaryNote).context.meaning && (
              <p className="leading-relaxed">
                <b className={`${fontColor}`}>
                  {transformTCOrSp("釋義", traditional)}：<br />
                </b>{" "}
                <span className={fontColor}>
                  {Array.isArray((item.note as DictionaryNote).context.meaning)
                    ? (item.note as DictionaryNote).context.meaning?.map(
                        (m, idx) => (
                          <span key={idx}>
                            {transformTCOrSp(m || "", traditional)}
                            {idx <
                              (
                                (item.note as DictionaryNote).context
                                  .meaning as string[]
                              ).length -
                                1 && <br />}
                          </span>
                        )
                      )
                    : transformTCOrSp(
                        (item.note as DictionaryNote).context.meaning + "",
                        traditional
                      )}
                </span>
              </p>
            )}

            {/* for yyqk corpus */}
            {(item.note as DictionaryNote).context.introduction && (
              <p className="leading-relaxed">
                <b className={`${fontColor}`}>
                  {transformTCOrSp("介绍", traditional)}：<br />
                </b>{" "}
                <span className={fontColor}>
                  {transformTCOrSp(
                    (item.note as DictionaryNote).context.introduction + "",
                    traditional
                  )}
                </span>
              </p>
            )}
            {/* for yyqk lyric */}
            {(item.note as DictionaryNote).context.lyric &&
              typeof (item.note as DictionaryNote).context.lyric ===
                "string" && (
                <p className="leading-relaxed">
                  <b className={`${fontColor}`}>
                    {transformTCOrSp("歌词", traditional)}：<br />
                  </b>{" "}
                  <span className={fontColor}>
                    {transformTCOrSp(
                      (item.note as DictionaryNote).context.lyric + "",
                      traditional
                    )}
                    <br />
                    {(item.note as DictionaryNote).context.pron}
                  </span>
                </p>
              )}

            {(item.note as DictionaryNote).contributor && (
              <p className="leading-relaxed mt-16 italic">
                <b className={`${fontColor}`}>
                  {transformTCOrSp("貢獻者", traditional)}：
                </b>{" "}
                <span className={fontColor}>
                  {(item.note as DictionaryNote).contributor}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
