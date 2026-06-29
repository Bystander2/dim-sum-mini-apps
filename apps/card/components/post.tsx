import { CardContentItem } from "@/types";
import { Button } from "./ui/button";
import CardContent from "./cardContent";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import domtoimage from "dom-to-image";
import { toast } from "sonner";

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    }),
  );
}

export default function Post({
  fontFamily,
  item,
  transformTCOrSp,
  traditional,
  category,
  mode,
}: CardContentItem) {
  const [scale, setScale] = useState("normal");
  const [submitInfo, setSubmitInfo] = useState("下载");
  const cardRef = useRef<HTMLDivElement>(null);
  const themeClass = mode === "dark" ? "theme-dark" : "theme-light";
  const primaryButtonClass =
    "bg-[var(--ds-primary)] text-white hover:bg-[var(--ds-primary)] hover:opacity-90 active:bg-[var(--ds-primary)] active:opacity-100 focus-visible:bg-[var(--ds-primary)] focus-visible:ring-[var(--ds-primary)]/40";

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      setSubmitInfo("下载中...");
      await waitForImages(cardRef.current);

      const scale = 3;
      const width = cardRef.current.offsetWidth;
      const height = cardRef.current.offsetHeight;
      const backgroundColor = window.getComputedStyle(
        cardRef.current,
      ).backgroundColor;

      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: backgroundColor,
        width: width * scale,
        height: height * scale,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          "transform-origin": "top left",
        },
      });

      const link = document.createElement("a");
      link.download = `yue-card-${item.data}.png`;
      link.href = dataUrl;
      setSubmitInfo("下载");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
  };
  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setScale("normal");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${primaryButtonClass}`}
        >
          预览
        </Button>
      </DialogTrigger>
      <DialogTitle />
      <DialogContent
        className={`${themeClass} w-auto max-w-[calc(100vw-2rem)] sm:!max-w-[1040px] rounded-none border-[var(--ds-border)] bg-[var(--ds-background)] text-[var(--ds-foreground)] [&>button]:hidden max-h-[98vh] overflow-y-auto`}
      >
        <CardContent
          cardRef={cardRef}
          isQrcode={true}
          scale={scale}
          fontFamily={fontFamily}
          item={item}
          transformTCOrSp={transformTCOrSp}
          traditional={traditional}
          category={category}
          mode={mode}
        />
        <DialogFooter className="flex-row flex-wrap border-t border-[var(--ds-border)] pt-4 sm:justify-between">
          <div className="flex gap-3 justify-start ">
            <Label htmlFor="size-change">文字大小调整：</Label>
            <RadioGroup
              defaultValue="normal"
              className="grid grid-cols-3"
              id="size-change"
              onValueChange={(value) => setScale(value)}
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem
                  value="normal"
                  id="r1"
                  className="border-[var(--ds-border)] text-[var(--ds-primary)] [&_svg]:fill-[var(--ds-primary)]"
                />
                <Label htmlFor="r1">正常</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem
                  value="large"
                  id="r2"
                  className="border-[var(--ds-border)] text-[var(--ds-primary)] [&_svg]:fill-[var(--ds-primary)]"
                />
                <Label htmlFor="r2">大</Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem
                  value="xl"
                  id="r3"
                  className="border-[var(--ds-border)] text-[var(--ds-primary)] [&_svg]:fill-[var(--ds-primary)]"
                />
                <Label htmlFor="r3">特大</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-2 ">
            <Button
              type="submit"
              onClick={handleDownload}
              className={primaryButtonClass}
            >
              {submitInfo}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
