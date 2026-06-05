"use server";

import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function authFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });
}

/* Points */

export async function getPointsAction() {
  try {
    const res = await authFetch("/progress/points");

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

/* Streak */

export async function getStreakAction() {
  try {
    const res = await authFetch("/progress/streak");

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

/* Level Complete */

export async function postLevelCompleteAction(levelId: string) {
  try {
    const res = await authFetch("/progress/level-complete", {
      method: "POST",
      body: JSON.stringify({ level_id: levelId }),
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

/* Full Progress */

export async function getUserProgressAction() {
  const [
    pointsRes,
    levelRes,
    streakRes,
    wordStatsRes,
    roomsRes,
  ] = await Promise.all([
    authFetch("/progress/points"),
    authFetch("/progress/level"),
    authFetch("/progress/streak"),
    authFetch("/learning/words/stats"),
    authFetch("/kg/rooms/progress"),
  ]);

  if (
    !pointsRes.ok ||
    !levelRes.ok ||
    !streakRes.ok ||
    !wordStatsRes.ok ||
    !roomsRes.ok
  ) {
    return null;
  }

  const [
    points,
    level,
    streak,
    wordStats,
    roomsProgress,
  ] = await Promise.all([
    pointsRes.json(),
    levelRes.json(),
    streakRes.json(),
    wordStatsRes.json(),
    roomsRes.json(),
  ]);

  const roomsCompleted = Math.max(0, Number(roomsProgress?.completed_rooms) || 0);
  const totalRooms = Math.max(1, Number(roomsProgress?.total_rooms) || 4);

  return {
    totalPoints: points.total_points,
    roomsCompleted,
    totalRooms,
    levelsCompleted: level.level,
    wordsLearned: wordStats.total_words_learned,
    dayStreak: streak.current_streak,
  };
}