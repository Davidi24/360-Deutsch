"use client";

import "@google/model-viewer";
import { useEffect, useRef, useState } from "react";

type FloatingObject = {
  id: string;
  src: string;
  cameraOrbit?: string;
};

type Props = {
  objects: FloatingObject[];
  onSelect: (id: string) => void;
};

const positionsDesktop = [
  "md:absolute md:top-[10%] md:left-[8%]",
  "md:absolute md:top-[10%] md:right-[8%]",
  "md:absolute md:bottom-[10%] md:right-[8%]",
  "md:absolute md:bottom-[10%] md:left-[8%]",
  "md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
];

const positionsMobile = [
  "col-start-1 row-start-1 justify-self-center",
  "col-start-2 row-start-1 justify-self-center",
  "col-start-1 row-start-2 justify-self-center",
  "col-start-2 row-start-2 justify-self-center",
  "col-start-1 col-span-2 row-start-3 justify-self-center",
];

function FloatingModel({
  obj,
  positionDesktop,
  positionMobile,
  onSelect,
}: {
  obj: FloatingObject;
  positionDesktop: string;
  positionMobile: string;
  onSelect: (id: string) => void;
}) {
  const viewerRef = useRef<HTMLModelViewerElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const baseOrbit = obj.cameraOrbit || "0deg 75deg auto";
    const [h, v, d] = baseOrbit.split(" ");
    const baseAngle = parseFloat(h) || 0;

    let angle = baseAngle;
    let dir = 1;
    let userInteracting = false;

    el.cameraOrbit = baseOrbit;

    const down = () => (userInteracting = true);
    const up = () => (userInteracting = false);

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);

    const interval = setInterval(() => {
      if (userInteracting) return;

      angle += dir * 0.2;

      if (angle >= baseAngle + 30) dir = -1;
      if (angle <= baseAngle - 30) dir = 1;

      el.cameraOrbit = `${angle}deg ${v} ${d}`;
    }, 16);

    return () => {
      clearInterval(interval);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
    };
  }, [obj]);

  function handleClick() {
    setActive(true);
    onSelect(obj.id);

    setTimeout(() => {
      setActive(false);
    }, 300);
  }

  return (
    <div
      className={`
        flex items-center justify-center cursor-pointer
        ${positionMobile}
        ${positionDesktop}
      `}
      onClick={handleClick}
    >
      <div
        className={`
          w-[90px] h-[90px]
          sm:w-[110px] sm:h-[110px]
          md:w-[140px] md:h-[140px]
          xl:w-[160px] xl:h-[160px]
          animate-float
          will-change-transform
          rounded-xl
          transition-transform duration-200
          dark:bg-transparent
          ${active ? "scale-110" : "scale-100"}
        `}
      >
        <model-viewer
          ref={viewerRef}
          src={obj.src}
          camera-controls
          disable-zoom
          interaction-prompt="none"
          disable-tap
          className="w-full h-full"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}

export default function FloatingObjects({ objects, onSelect }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      className={`
        relative flex-1 overflow-visible select-none
        min-h-[320px] sm:min-h-[380px]
        grid grid-cols-2 grid-rows-3 gap-4 sm:gap-6
        md:grid-cols-none md:grid-rows-none md:block
      `}
    >
      {objects.map((obj, index) => (
        <FloatingModel
          key={obj.id}
          obj={obj}
          positionDesktop={positionsDesktop[index]}
          positionMobile={positionsMobile[index]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
