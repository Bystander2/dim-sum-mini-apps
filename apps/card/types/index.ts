import { RefObject } from "react";

interface DictionaryContext {
  page?: number;
  number?: string;
  others?: {
    異體?: any[];
    校訂註?: string | null;
  };
  pinyin?: string[];
  meaning?: string[];
  author?: string;
  lyric?: string;
  pron?: string;
  introduction?: string;
  song_name_pin?: string;
}
export interface DictionaryNote {
  context: DictionaryContext;
  contributor?: string;
}

export type Note = DictionaryNote;

export interface CorpusItem {
  id: string;
  unique_id: string;
  data: string;
  category: string;
  note: Note;
  tags: string[];
}

export interface CardContentItem {
  cardRef?: RefObject<HTMLDivElement | null>;
  scale?: string;
  isQrcode: boolean;
  bg: string;
  fontColor: string;
  fontFamily: string;
  transformTCOrSp: (str: string, isTraditional: boolean) => string;
  traditional: boolean;
  item: CorpusItem;
}
