"use client";
import { CardMode, CorpusCategory, CorpusItem } from "@/types";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { sify, tify } from "chinese-conv/dist";
import Post from "./post";
import CardContent from "./cardContent";
import { useSearchParams } from "next/navigation";

function transformTCOrSp(str: string, isTrandition: boolean) {
  return isTrandition ? tify(str) : sify(str);
}

const YueCard = ({
  item,
  category,
}: {
  item: CorpusItem;
  category: CorpusCategory | null;
}) => {
  const searchParams = useSearchParams();
  const mode: CardMode = searchParams.get("mode") === "dark" ? "dark" : "light";
  const switchRootClass =
    mode === "dark"
      ? "border-[#5aa8ff] bg-[#5aa8ff] data-[state=checked]:bg-[#5aa8ff] data-[state=unchecked]:bg-[#5aa8ff] shadow-[0_0_0_3px_rgba(90,168,255,0.35),0_0_18px_rgba(90,168,255,0.35)] focus-visible:ring-[#5aa8ff]/40"
      : "border-[#d1d5db] bg-[#d8dadd] data-[state=checked]:bg-[#d8dadd] data-[state=unchecked]:bg-[#d8dadd] shadow-[0_2px_10px_rgba(15,23,42,0.18)]";
  const switchThumbClass =
    mode === "dark"
      ? "bg-[#07111f] data-[state=checked]:translate-x-[24px] data-[state=unchecked]:translate-x-0"
      : "bg-white data-[state=checked]:translate-x-[24px] data-[state=unchecked]:translate-x-0";
  const switchTextClass = mode === "dark" ? "text-white" : "text-[#6b7280]";
  const fontFamily = searchParams.get("fontFamily") || "Noto Sans SC";
  const [traditional, setTranditional] = useState(
    searchParams.get("lang") === "jian" ? false : true,
  );

  return (
    <div className="w-[min(92vw,960px)] space-y-4">
      <div className="flex flex-wrap justify-around gap-4 items-start">
        <div className="flex items-center pt-2">
          <Switch
            id="language-mode"
            aria-label="简繁体切换"
            className={`relative h-7 w-[52px] border-[3px] p-0.5 focus-visible:ring-offset-0 ${switchRootClass}`}
            thumbClassName={`relative z-10 size-[22px] ${switchThumbClass}`}
            checked={traditional}
            onCheckedChange={(value) => setTranditional(value)}
          >
            <span
              className={`pointer-events-none absolute z-0 text-xs font-bold leading-none ${switchTextClass} ${
                traditional ? "left-2.5" : "right-1.5"
              }`}
            >
              {traditional ? "繁" : "简"}
            </span>
          </Switch>
        </div>
      </div>
      <CardContent
        fontFamily={fontFamily}
        item={item}
        transformTCOrSp={transformTCOrSp}
        traditional={traditional}
        isQrcode={false}
        category={category}
        mode={mode}
      />
      <div className="flex justify-end">
        <Post
          fontFamily={fontFamily}
          item={item}
          transformTCOrSp={transformTCOrSp}
          traditional={traditional}
          isQrcode={false}
          category={category}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default YueCard;
