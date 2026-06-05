"use client";

import Link from "next/link";
import RoomProgressCard from "./RoomProgressCard";
import type { Room } from "./room";

export default function RoomNode({
  room,
  theme,
  isRight,
}: {
  room: Room;
  theme: "light" | "dark";
  isRight: boolean;
}) {
  const content = (
    <>
      <div className="absolute inset-0 blur-2xl bg-violet-500/40 rounded-full opacity-60 pointer-events-none" aria-hidden />
      <div className="relative flex items-center justify-center transition group-hover:scale-105">
        <img
          src={room.image}
          alt={room.name}
          className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-[260px] xl:h-[260px] max-w-[90vw] object-contain drop-shadow-xl"
        />
      </div>
      <RoomProgressCard room={room} theme={theme} isRight={isRight} />
    </>
  );

  if (room.link) {
    return (
      <Link
        href={room.link}
        className="relative group block cursor-pointer min-w-[120px] min-h-[120px] touch-manipulation select-none active:scale-[0.98] [-webkit-tap-highlight-color:transparent]"
        style={{ touchAction: "manipulation" }}
        aria-label={`Open ${room.name}`}
      >
        {content}
      </Link>
    );
  }

  return <div className="relative group">{content}</div>;
}