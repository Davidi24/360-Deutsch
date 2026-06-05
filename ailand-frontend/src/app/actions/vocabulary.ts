"use server";

import { apiRequest } from "@/app/api/request";
import { vocabularyMock } from "@/lib/vocabularyMoc";
import type {
  RoomsListResponseBE,
  RoomSubjectsResponseBE,
  LearnedWordsResponseBE,
  InProgressWordsResponseBE,
  VocabularyUI,
  WordStatusUI,
  WordUI,
} from "@/types/vocabulary";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function getVocabularyAction(
  level: string,
  selectedRoomId?: string | null
): Promise<VocabularyUI> {
  if (USE_MOCK) return vocabularyMock;

  const roomsRes = await apiRequest("/kg/rooms");
  const subjectsRes = await apiRequest(`/kg/rooms/${level}/subjects?limit=100&offset=0`);

  if (!roomsRes.ok) {
    const text = await roomsRes.text().catch(() => "");
    throw new Error(`HTTP ${roomsRes.status}: ${text || "Failed to load rooms"}`);
  }
  if (!subjectsRes.ok) {
    const text = await subjectsRes.text().catch(() => "");
    throw new Error(`HTTP ${subjectsRes.status}: ${text || "Failed to load subjects"}`);
  }

  const roomsData = (await roomsRes.json()) as RoomsListResponseBE;
  const subjectsData = (await subjectsRes.json()) as RoomSubjectsResponseBE;
  const rooms = roomsData.rooms;
  const subjects = subjectsData.subjects;
  const roomId = selectedRoomId ?? (rooms[0]?.room_id ?? null);

  let learnedSet = new Set<string>();
  let inProgSet = new Set<string>();

  const learnedRes = await apiRequest(
    `/learning/words/learned?room_id=${encodeURIComponent(level)}&limit=200&offset=0`
  );
  const inProgRes = await apiRequest(
    `/learning/words/in-progress?room_id=${encodeURIComponent(level)}&limit=200&offset=0`
  );

  if (learnedRes.ok && inProgRes.ok) {
    const [learned, inProg] = await Promise.all([
      learnedRes.json() as Promise<LearnedWordsResponseBE>,
      inProgRes.json() as Promise<InProgressWordsResponseBE>,
    ]);
    learnedSet = new Set(learned.words.map((w) => w.word_id));
    inProgSet = new Set(inProg.words.map((w) => w.word_id));
  }

  const words: WordUI[] = subjects.map((s) => {
    let status: WordStatusUI = "not_started";
    if (learnedSet.has(s.id)) status = "learned";
    else if (inProgSet.has(s.id)) status = "in_progress";
    return {
      id: s.id,
      german: s.german,
      english: s.english,
      pos: s.pos,
      status,
    };
  });

  const learnedCount = words.filter((w) => w.status === "learned").length;
  const inProgressCount = words.filter((w) => w.status === "in_progress").length;

  return {
    level,
    rooms,
    selectedRoomId: roomId,
    totals: {
      totalWords: words.length,
      learned: learnedCount,
      inProgress: inProgressCount,
    },
    words,
  };
}
