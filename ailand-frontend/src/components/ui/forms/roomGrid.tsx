"use client";

import { useRouter } from "next/navigation";
import { ROOMS } from "@/data/roomsdata";
import { RoomCard } from "./roomCard";

type Props = {
  roomsCompleted: number;
};

export function RoomsGrid({ roomsCompleted }: Props) {
  const router = useRouter();

 
  const unlockedUpTo = 1; 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0 lg:min-w-[72rem]">
      {ROOMS.map((room) => {
        const locked = room.id > unlockedUpTo;

        return (
          <RoomCard
            key={room.id}
            room={room}
            locked={locked}
            onStart={() => router.push(`/dashboard/rooms/${room.id}`)}
          />
        );
      })}
    </div>
  );
}
