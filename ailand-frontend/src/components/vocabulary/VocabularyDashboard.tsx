"use client";

import React, { useEffect, useMemo, useState } from "react";
//import { getVocabularyAction } from "@/app/actions/vocabulary";
import type { VocabularyUI, WordUI } from "@/types/vocabulary";
import { Check, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const MOCK_DATA: Record<string, VocabularyUI> = {
  A1: {
    level: "A1",
    totals: {
      totalWords: 11,
      learned: 4,
      inProgress: 3,
    },
    rooms: [
      {
        room_id: "study",
        name: "Study Room",
        word_count: 12,
        image: "/images/rooms_w_bg/studyroom.png",
      },
      {
        room_id: "kitchen",
        name: "Kitchen",
        word_count: 8,
        image: "/images/rooms_w_bg/kitchen.png",
      },
      {
        room_id: "bedroom",
        name: "Bedroom",
        word_count: 6,
        image: "/images/rooms_w_bg/bedroom.png",
      },
    ],
    selectedRoomId: "study",
    words: [
      {
        id: "1",
        german: "der Tisch",
        english: "table",
        status: "learned",
        isDifficult: false,
        image: "/images/objects/table.png",
      },
      {
        id: "2",
        german: "der Stuhl",
        english: "chair",
        status: "learned",
        isDifficult: false,
        image: "/images/objects/chair.png",
      },
      {
        id: "4",
        german: "die Lampe",
        english: "lamp",
        status: "learned",
        isDifficult: false,
        image: "/images/objects/lamp.png",
      },
      {
        id: "9",
        german: "die Uhr",
        english: "clock",
        status: "learned",
        isDifficult: false,
        image: "/images/objects/clock.png",
      },
      {
        id: "10",
        german: "das Regal",
        english: "shelf",
        status: "new",
        isDifficult: false,
        image: "/images/objects/shelf.png",
      },
      {
        id: "11",
        german: "der Bildschirm",
        english: "monitor",
        status: "new",
        isDifficult: true,
        image: "/images/objects/monitor.png",
      },
      {
        id: "12",
        german: "die Pflanze",
        english: "plant",
        status: "new",
        isDifficult: false,
        image: "/images/objects/plant.png",
      },
      {
        id: "13",
        german: "der Kalender",
        english: "calendar",
        status: "new",
        isDifficult: false,
        image: "/images/objects/calendar.png",
      },
      {
        id: "14",
        german: "die Tastatur",
        english: "keyboard",
        status: "new",
        isDifficult: false,
        image: "/images/objects/keyboard.png",
      },
      {
        id: "15",
        german: "das Notizbuch",
        english: "notebook",
        status: "new",
        isDifficult: false,
        image: "/images/objects/notebook.png",
      },
      {
        id: "16",
        german: "das Fenster",
        english: "window",
        status: "new",
        isDifficult: false,
        image: "/images/objects/window.png",
      },
    ]
  },
};

const LEVELS = ["A1", "A2", "B1"];

export function VocabularyDashboard() {
  const [level, setLevel] = useState("A1");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [difficultOnly, setDifficultOnly] = useState(false);

  const [data, setData] = useState<VocabularyUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const res = MOCK_DATA[level];
      setData(res);

      if (!roomId && res.selectedRoomId) {
        setRoomId(res.selectedRoomId);
      }
    } catch (e) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const words: WordUI[] = useMemo(() => {
    if (!data) return [];
    if (!difficultOnly) return data.words;
    return data.words.filter((w) => w.isDifficult);
  }, [data, difficultOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5a47c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading vocabulary…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold text-foreground mb-2">Failed to load vocabulary</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg bg-[#5a47c7] text-white hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { totals, rooms } = data;
  const learnedPct = totals.totalWords > 0 ? (totals.learned / totals.totalWords) * 100 : 0;
  const inProgressPct = totals.totalWords > 0 ? (totals.inProgress / totals.totalWords) * 100 : 0;
  const selectedRoom = roomId ? rooms.find((r) => r.room_id === roomId) : null;
  const sectionTitle = selectedRoom ? selectedRoom.name : "All Words";

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-w-0">
      {/* Header */}
     

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[130px] bg-card border-border rounded-xl py-2.5 text-foreground font-medium focus:ring-2 focus:ring-[#5a47c7]/30">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>{`Level ${l}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={roomId ?? "__all__"}
            onValueChange={(v) => setRoomId(v === "__all__" ? null : v)}
          >
            <SelectTrigger className="min-w-[160px] bg-card border-border rounded-xl py-2.5 text-foreground font-medium focus:ring-2 focus:ring-[#5a47c7]/30">
              <SelectValue placeholder="Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Rooms</SelectItem>
              {rooms.map((r) => (
                <SelectItem key={r.room_id} value={r.room_id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2 text-foreground text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={difficultOnly}
              onChange={(e) => setDifficultOnly(e.target.checked)}
              className="rounded border-border text-[#5a47c7] focus:ring-[#5a47c7]"
            />
            Difficult Words Only
          </label>
        </div>

        {/* Progress section – two-segment bar + labels */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-lg font-semibold text-foreground mb-4">
            {totals.totalWords} Words Total
          </p>
          <div className="w-full h-4 rounded-full bg-muted overflow-hidden flex">
            {learnedPct > 0 && (
              <div
                className="h-full bg-[#5a47c7] transition-all duration-500"
                style={{ width: `${learnedPct}%` }}
              />
            )}
            {inProgressPct > 0 && (
              <div
                className="h-full bg-[#9160a8] transition-all duration-500"
                style={{ width: `${inProgressPct}%` }}
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5a47c7]/15 px-3 py-1 text-sm font-medium text-[#5a47c7]">
              {totals.learned} are Learned
            </span>
            <span className="text-sm text-muted-foreground">
              {totals.inProgress} in progress
            </span>
            <span className="ml-auto text-sm text-muted-foreground">
              {totals.learned} / {totals.totalWords}
            </span>
          </div>
        </div>

        {/* Categories */}
        <h2 className="text-xl font-bold text-foreground mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {rooms.map((r) => {
            const isSelected = roomId === r.room_id;
            const isCurrentLevel = r.room_id === level;
            const roomLearned = isCurrentLevel ? totals.learned : 0;
            const roomInProgress = isCurrentLevel ? totals.inProgress : 0;
            const roomTotal = isCurrentLevel ? totals.totalWords : r.word_count;
            const status =
              roomLearned === roomTotal && roomTotal > 0
                ? "completed"
                : roomLearned > 0 || roomInProgress > 0
                  ? "in_progress"
                  : "new";

            return (
              <button
                key={r.room_id}
                type="button"
                onClick={() => {
                  setLevel(r.room_id);
                  setRoomId(r.room_id);
                }}
                className={`text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${isSelected
                    ? "border-[#5a47c7] ring-2 ring-[#5a47c7]/20"
                    : "border-border hover:border-[#9160a8]/50 hover:shadow-lg"
                  }`}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#ede6f2] via-[#ede6f2] to-[#ebc6ae]/40 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-60">
                    {r.image && (
                      <img
                        src={r.image}
                        alt={r.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    {status === "completed" && (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>Completed</span>
                      </>
                    )}
                    {status === "in_progress" && (
                      <>
                        <Heart className="h-4 w-4 text-[#9160a8] fill-[#9160a8]" />
                        <span>In progress</span>
                      </>
                    )}
                    {status === "new" && (
                      <span>Not started</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Word list header */}
        <div className="flex items-center gap-2 mb-4">
          {words.some((w) => w.status === "learned") && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            </span>
          )}
          <h2 className="text-xl font-bold text-foreground">{sectionTitle}</h2>
        </div>

        {/* Word cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {words.map((w) => (
            <div
              key={w.id}
              className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Learned checkmark */}
              {w.status === "learned" && (
                <div className="absolute z-20 top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-4 w-4 text-white stroke-[2.5]" />
                </div>
              )}

              {/* Placeholder illustration */}
              <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                {w.image ? (
                  <img
                    src={w.image}
                    alt={w.german}
                    className="w-full h-full object-cover scale-120"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ede6f2] to-[#ebc6ae]/50">
                    <span className="text-2xl sm:text-3xl font-bold text-[#9160a8]/50">
                      {w.german.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <p className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                {w.german}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{w.english}</p>
            </div>
          ))}
        </div>

        {words.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {difficultOnly ? "No difficult words in this selection." : "No words in this category yet."}
          </p>
        )}
      </div>
    </div>
  );
}
