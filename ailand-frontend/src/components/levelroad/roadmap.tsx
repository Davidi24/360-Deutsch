"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { levelroadData } from "@/data/levelroadData";
import { ROOMS } from "@/data/roomsdata";
import LevelCard from "@/components/levelroad/levelcard";
import Connector from "@/components/levelroad/connector";
import RoomViewEmbedded from "@/app/room/RoomViewEmbedded";
import { useProgress } from "@/lib/useProgress";
import type { LevelStatus } from "@/types/levelroadmap";
import type { RoadmapLevel } from "@/types/levelroadmap";

function statusForLevel(
  levelId: number,
  roomsCompleted: number
): LevelStatus {
  // Level N is completed if user has completed N or more rooms
  if (roomsCompleted >= levelId) return "completed";
  // Level N is active (current) if user has completed N-1 rooms
  if (roomsCompleted === levelId - 1) return "active";
  // Otherwise locked (previous level not completed yet)
  return "locked";
}

const Roadmap: React.FC = () => {
  const router = useRouter();
  const { progress } = useProgress();
  const roomsCompleted = progress.roomsCompleted;

  const levelsWithStatus = useMemo(
    (): RoadmapLevel[] =>
      levelroadData.map((level) => ({
        ...level,
        status: statusForLevel(level.id, roomsCompleted),
      })),
    [roomsCompleted]
  );

  const handleContinue = (id: number) => {
    const roomId = Math.min(id, ROOMS.length);
    router.push(`/dashboard/side_room/level${roomId}`);
  };

  return (
    <div
      className="min-h-screen px-4 py-8 bg-gradient-to-b from-[var(--palette-lavender)]/40 via-[var(--palette-peach)]/20 to-[var(--palette-lavender)]/30 dark:from-background dark:via-background dark:to-background"
    >
     
      <div className="grid grid-cols-[420px_1fr] gap-7 h-[calc(100vh-200px)] min-h-[500px] max-[1000px]:grid-cols-1 max-[1000px]:h-auto">
        <div className="flex flex-col overflow-auto max-[1000px]:overflow-visible max-[1000px]:relative max-[1000px]:z-0 max-[1000px]:isolate">
          <div className="flex flex-col">
            {levelsWithStatus.map((level, index) => (
              <React.Fragment key={level.id}>
                <LevelCard level={level} onContinue={handleContinue} />
                {index < levelsWithStatus.length - 1 && (
                  <Connector
                    fromCompleted={
                      level.status === "completed" || level.status === "active"
                    }
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        
        <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-md dark:shadow-none self-start max-[1000px]:relative max-[1000px]:z-0">
          <RoomViewEmbedded height="480px" />
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
