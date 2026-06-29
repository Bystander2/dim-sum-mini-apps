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

interface StructuredNoteBlock {
  type?: string;
  content?: string;
  jyutping?: string;
  jytping?: string;
}

interface StructuredNoteDataItem {
  blocks?: StructuredNoteBlock[];
  jyutping?: string;
  jytping?: string;
}

export interface StructuredNote {
  data?: StructuredNoteDataItem[];
}

export interface CorpusItem {
  id: string;
  unique_id: string;
  data: string;
  category: string;
  note: Note;
  structured_note?: StructuredNote;
  tags: string[];
}

export interface CorpusCategory {
  id?: string;
  name?: string;
  nickname?: string;
  tags?: string[];
  [key: string]: unknown;
}

export type CardMode = "light" | "dark";

export interface CardContentItem {
  cardRef?: RefObject<HTMLDivElement | null>;
  scale?: string;
  isQrcode: boolean;
  fontFamily: string;
  mode: CardMode;
  transformTCOrSp: (str: string, isTraditional: boolean) => string;
  traditional: boolean;
  item: CorpusItem;
  category: CorpusCategory | null;
}
