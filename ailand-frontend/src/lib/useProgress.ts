"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserProgressAction } from "@/app/actions/progress";

export const PROGRESS_STORAGE_KEY = "progress";

type Progress = {
  roomsCompleted: number;
  totalRooms: number;
};

const DEFAULT_PROGRESS: Progress = {
  roomsCompleted: 0,
  totalRooms: 4,
};

function readProgressFromStorage(): Progress {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return DEFAULT_PROGRESS;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);

  const loadProgress = useCallback(async () => {
    const server = await getUserProgressAction();
    const storage = readProgressFromStorage();
    const serverRooms = server != null ? Math.max(0, server.roomsCompleted) : null;
    const totalRooms = Math.max(1, server?.totalRooms ?? storage.totalRooms ?? 4);

    let roomsCompleted: number;
    if (serverRooms === null) {
      roomsCompleted = Math.max(0, storage.roomsCompleted ?? 0);
    } else if (serverRooms === 0) {
      roomsCompleted = Math.min(1, Math.max(0, storage.roomsCompleted ?? 0));
    } else {
      roomsCompleted = Math.max(serverRooms, storage.roomsCompleted ?? 0);
    }
    roomsCompleted = Math.min(roomsCompleted, totalRooms);

    const next = { roomsCompleted, totalRooms };
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadProgress();
    const handler = () => loadProgress();
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, [loadProgress]);

  const updateProgress = (next: Progress) => {
    setProgress(next);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("progress-updated"));
  };

  return { progress, updateProgress };
}
