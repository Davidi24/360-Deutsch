export type Room = {
  room_id: string;
  name: string;
  word_count: number;
  image?: string;
};

export type WordStatusUI = "learned" | "in_progress" | "new";

export type WordUI = {
  id: string;
  german: string;
  english: string;
  status: WordStatusUI;
  isDifficult?: boolean;
  image?: string;
};

export type VocabularyUI = {
  level: string;
  rooms: Room[];
  selectedRoomId: string | null;

  totals: {
    totalWords: number;
    learned: number;
    inProgress: number;
  };

  words: WordUI[];
};