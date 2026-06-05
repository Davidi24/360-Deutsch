"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { rooms } from "./room";
import Road from "./Road";
import RoomNode from "./RoomNode";

gsap.registerPlugin(ScrollTrigger);

type Theme = "light" | "dark";

type RoomPos = { x: number; y: number; isRight: boolean };

export default function Page() {
  const [theme, setTheme] = useState<Theme>("dark");
  const items = useRef<HTMLDivElement[]>([]);
  const [positions, setPositions] = useState<RoomPos[]>([]);
  const hasAnimatedIn = useRef(false);

  const roadmapHeight = useMemo(() => {
    const BASE_HEIGHT = 1500;
    const STEP = 280;
    return BASE_HEIGHT + Math.max(0, rooms.length - 5) * STEP;
  }, []);

  useEffect(() => {
    if (hasAnimatedIn.current) return;
    if (positions.length !== rooms.length) return;

    hasAnimatedIn.current = true;
    requestAnimationFrame(() => {
      items.current.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: "+=80", scale: 0.85 },
          {
            opacity: 1,
            y: "-=80",
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              once: true,
            },
          },
        );
      });
    });
  }, [positions.length]);

  useEffect(() => {
    const compute = (): boolean => {
      const container = document.getElementById("roadmap");
      const path = document.getElementById("road-path") as SVGPathElement | null;
      if (!container || !path) return false;

      const containerRect = container.getBoundingClientRect();
      const ctm = path.getScreenCTM();
      if (!ctm) return false;

      const total = path.getTotalLength();
      const base: RoomPos[] = rooms.map((room, i) => {
        const t = room.pathT ?? (i + 1) / (rooms.length + 1);
        const p = path.getPointAtLength(total * t);
        const sp = new DOMPoint(p.x, p.y).matrixTransform(ctm);

        const x = sp.x - containerRect.left + (room.offsetX ?? 0);
        const y = sp.y - containerRect.top + (room.offsetY ?? 0);
        const isRight = x >= containerRect.width / 2;

        return { x, y, isRight };
      });

      const idToIndex = new Map<number, number>();
      rooms.forEach((r, idx) => idToIndex.set(r.id, idx));

      const next: RoomPos[] = base.map((pos, i) => {
        const room = rooms[i];
        if (!room.alignYWithRoomId) return pos;

        const targetIndex = idToIndex.get(room.alignYWithRoomId);
        if (targetIndex === undefined) return pos;

        const target = base[targetIndex];
        const y = target.y + (room.offsetY ?? 0);
        const isRight = pos.x >= containerRect.width / 2;
        return { x: pos.x, y, isRight };
      });

      setPositions(next);
      return true;
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);

      let tries = 0;
      const tick = () => {
        // Let Road re-render on resize before sampling
        const ok = compute();
        if (ok) return;
        tries += 1;
        if (tries < 60) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(() => requestAnimationFrame(tick));
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      id="roadmap"
      data-theme={theme}
      className={`
        relative overflow-hidden transition-colors duration-300
   
      `}
      style={{ minHeight: roadmapHeight }}
    >
      <Road count={rooms.length} />
      <div className="relative z-10" style={{ height: roadmapHeight }}>
        {rooms.map((room, i) => {
          const pos = positions[i];
          if (!pos) return null;

          return (
          <div
            key={room.id}
            ref={(el) => {
              if (el) items.current[i] = el;
            }}
            className="absolute"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2">
              <RoomNode room={room} theme={theme} isRight={pos.isRight} />
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
