"use client";

import {
    CheckIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    PencilSquareIcon,
    LockClosedIcon,
    SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import type { Room } from "./room";

const GRADIENT =
    "from-[#5a47c7] via-[#9160a8] via-[#c084fc] to-[#fb923c]";

type NodeState = "done" | "active" | "locked";

/* Border colors by position */
const NODE_COLORS = [
    "#5a47c7",
    "#9e7ee3",
    "#cb98e2",
    "#e8a090",
];

export default function RoomProgressCard({
    room,
    theme,
    isRight,
}: {
    room: Room;
    theme: "light" | "dark";
    isRight: boolean;
}) {
    /* ---------- STATE ---------- */

    const states: NodeState[] =
        room.id === 1
            ? ["done", "done", "active", "locked"]
            : ["locked", "locked", "locked", "locked"];

    const progress = room.id === 1 ? 75 : 0;

    /* --------------------------- */

    return (
        <div
            className={`
    absolute top-1/2 -translate-y-1/2
    ${isRight ? "left-24 sm:left-32 md:left-40 lg:left-52" : "right-24 sm:right-32 md:right-40 lg:right-52"}

    w-[min(320px,calc(100vw-2.5rem))] max-w-[320px]
    rounded-2xl
    backdrop-blur-2xl
    p-4

    opacity-0 scale-95 pointer-events-none
    transition-all duration-300

    group-hover:opacity-100
    group-hover:scale-100
    group-hover:pointer-events-auto

    ${theme === "dark"
                    ? `
        bg-[#0f172a]/95
        border border-white/10
        shadow-[0_24px_48px_rgba(0,0,0,0.5)]
      `
                    : `
        bg-white/90
        border border-white/40
        shadow-[0_24px_48px_rgba(0,0,0,0.12)]
      `
                }
  `}
        >
            {/* Header */}

            <div className="mb-3">
                <h3
                    className={`
    text-base font-semibold
    ${theme === "dark" ? "text-white" : "text-gray-900"}
  `}
                >                    {room.name}
                </h3>

                <p
                    className={`
    text-xs mt-0.5
    ${theme === "dark" ? "text-white/60" : "text-gray-500"}
  `}
                >
                    {room.id === 1 ? "3 / 4 Levels Completed" : "Locked"}
                </p>
            </div>

            {/* Timeline */}

            <div className="relative mb-3">

                {/* Track */}
                <div
                    className={`
            absolute top-1/2 left-0 right-0
            h-1.5 -translate-y-1/2 rounded-full
            bg-gradient-to-r ${GRADIENT}
            ${room.id === 1 ? "opacity-80" : "opacity-30"}
          `}
                />

                {/* Nodes */}
                <div className="relative z-10 flex justify-between">

                    <LevelNode
                        index={0}
                        state={states[0]}
                        icon={<BookOpenIcon />}
                    />

                    <LevelNode
                        index={1}
                        state={states[1]}
                        icon={<ChatBubbleLeftRightIcon />}
                    />

                    <LevelNode
                        index={2}
                        state={states[2]}
                        icon={<PencilSquareIcon />}
                    />

                    <LevelNode
                        index={3}
                        state={states[3]}
                        icon={<SpeakerWaveIcon />}
                    />
                </div>
            </div>

            {/* Labels */}

            <div
                className={`
    flex justify-between text-xs mb-3 px-0.5
    ${theme === "dark" ? "text-white/70" : "text-gray-600"}
  `}
            >
                <span>Vocabulary</span>
                <span>Phrases</span>
                <span>Grammar</span>
                <span>Listening</span>
            </div>

            {/* Progress */}

            <div className="flex items-center gap-2">

                <div
                    className={`
    flex-1 h-2 rounded-full overflow-hidden
    ${theme === "dark" ? "bg-white/10" : "bg-gray-200"}
  `}
                >
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${GRADIENT}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <span
  className={`
    text-xs font-medium
    ${theme === "dark"
      ? "text-violet-300"
      : "text-[#4f0b80]"
    }
  `}
>
                    {progress}% Complete
                </span>
            </div>
        </div>
    );
}

/* ---------------- NODE ---------------- */

function LevelNode({
    index,
    state,
    icon,
}: {
    index: number;
    state: NodeState;
    icon: React.ReactNode;
}) {
    const color = NODE_COLORS[index];

    const borderColor =
        state === "locked" ? "#d1d5db" : color;

    const iconColor =
        state === "locked" ? "#9ca3af" : color;

    return (
        <div
            className="
          w-8 h-8 rounded-full
          flex items-center justify-center
          border-2
          bg-white
          transition
        "
            style={{ borderColor }}
        >
            {state === "done" && (
                <CheckIcon
                    className="w-4 h-4"
                    style={{
                        color: iconColor,
                        strokeWidth: 3
                    }}
                />
            )}

            {state === "active" && (
                <div className="relative flex items-center justify-center">

                    {/* Pulse Ring */}
                    <span
                        className="
        absolute inset-0
        rounded-full
        animate-ping
        opacity-40
      "
                        style={{ backgroundColor: iconColor }}
                    />

                    {/* Glow Ring */}
                    <span
                        className="
        absolute inset-0
        rounded-full
        blur-md
        opacity-60
      "
                        style={{ backgroundColor: iconColor }}
                    />

                    {/* Main Icon */}
                    <div
                        className="relative w-4 h-4"
                        style={{
                            color: iconColor,
                            strokeWidth: 3
                        }}
                    >
                        {icon}
                    </div>

                </div>
            )}

            {state === "locked" && (
                <LockClosedIcon
                    className="w-4 h-4"
                    style={{
                        color: iconColor,
                        strokeWidth: 3
                    }}
                />
            )}
        </div>
    );
}