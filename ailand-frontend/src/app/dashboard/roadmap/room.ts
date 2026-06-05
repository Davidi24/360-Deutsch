export type Room = {
  id: number;
  name: string;
  image: string;
  pathT?: number; // 0..1 position along the road path
  offsetX?: number; // pixel offset from sampled point
  offsetY?: number; // pixel offset from sampled point
  alignYWithRoomId?: number; // force same vertical (screen) position as another room
  /** When set, clicking the room navigates to this path (e.g. level-roadmap) */
  link?: string;
};

export const rooms: Room[] = [
  { id: 1, name: "Wohnzimmer", image: "/images/rooms/wohnzimmer.png", offsetX: -260, offsetY: 350 },
  { id: 2, name: "Schlafzimmer", image: "/images/rooms/schlafzimmer.png", offsetX: 80, offsetY: 220 },
  { id: 3, name: "Arbeitszimmer", image: "/images/rooms/arbeitszimmer.png", pathT: 3.5 / 7, offsetX: -180, offsetY: 0, link: "/dashboard/level-roadmap" },
  { id: 4, name: "Badezimmer", image: "/images/rooms/badezimmer.png", offsetX: 250, offsetY: 100 },
  { id: 5, name: "Küche", image: "/images/rooms/kuche.png", offsetX: 0, offsetY: 0 },
  { id: 6, name: "Küche", image: "/images/rooms/kinderzimmer.png", offsetX: 0, offsetY: 0 },
];