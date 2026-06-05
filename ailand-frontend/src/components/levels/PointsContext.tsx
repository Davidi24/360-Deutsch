"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getPointsAction, getStreakAction, postLevelCompleteAction } from "@/app/actions/progress";
import { PROGRESS_STORAGE_KEY } from "@/lib/useProgress";

const STORAGE_KEY = "ailand-level-points";
const POINTS_PER_LEVEL = 10;
const TOTAL_ROOMS = 5;

type PointsState = {
  points: number;
  streak: number;
  addPoints: (amount: number) => void;
  reportLevelComplete: (pathname: string) => Promise<void>;
};

const PointsContext = createContext<PointsState | null>(null);

function levelIdFromPathname(pathname: string): string | null {
  const m = pathname.match(/\/level(\d+)$/);
  if (!m) return null;
  return `level${m[1]}`;
}

function levelNumberFromPathname(pathname: string): number | null {
  const m = pathname.match(/\/level(\d+)$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) ? null : n;
}

/** Persist completed level so roadmap unlocks the next (level 1 → roomsCompleted 1, etc.). */
function markLevelCompletedInProgress(pathname: string) {
  const levelNum = levelNumberFromPathname(pathname);
  if (levelNum == null || levelNum < 1) return;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const prev = typeof data.roomsCompleted === "number" ? data.roomsCompleted : 0;
    const totalRooms = typeof data.totalRooms === "number" ? data.totalRooms : TOTAL_ROOMS;
    const next = { roomsCompleted: Math.max(prev, levelNum), totalRooms };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("progress-updated"));
  } catch {
    // ignore
  }
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const useBackendRef = useRef<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPointsAction(), getStreakAction()]).then(([pointsData, streakData]) => {
      if (cancelled) return;
      if (pointsData) {
        useBackendRef.current = true;
        setPoints(pointsData.total_points);
      } else {
        useBackendRef.current = false;
        // Don't use localStorage when not logged in: show 0 so stars are per-user from backend only.
        setPoints(0);
      }
      if (streakData) setStreak(streakData.current_streak);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || useBackendRef.current !== false) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(points));
    } catch {
      // ignore
    }
  }, [points, hydrated]);

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => prev + Math.max(0, amount));
  }, []);

  const reportLevelComplete = useCallback(async (pathname: string) => {
    const levelId = levelIdFromPathname(pathname);
    if (!levelId) return;
    markLevelCompletedInProgress(pathname);
    const data = await postLevelCompleteAction(levelId);
    if (data) {
      setPoints(data.total_points);
      window.dispatchEvent(new Event("progress-updated"));
    } else {
      addPoints(POINTS_PER_LEVEL);
    }
    const streakData = await getStreakAction();
    if (streakData) setStreak(streakData.current_streak);
  }, [addPoints]);

  return (
    <PointsContext.Provider value={{ points, streak, addPoints, reportLevelComplete }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) {
    throw new Error("usePoints must be used within PointsProvider");
  }
  return ctx;
}
