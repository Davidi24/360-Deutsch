import * as THREE from "three";
import { createRoomCard } from "../cards/RoomCard";
import { ARNode } from "../core/arTypes";

export function buildRoomsView(
  scene: THREE.Scene,
  children: ARNode[],
  onEnter: (child: ARNode, card: THREE.Group) => void,
  onEnter3D: (child: ARNode, card: THREE.Group) => void,
) {
  const roomCards: THREE.Group[] = [];

  const maxFirstRow = 6;
  const firstRow = children.slice(0, maxFirstRow);
  const secondRow = children.slice(maxFirstRow);

  function placeRow(rowNodes: ARNode[], rowIndex: number) {
    const count = rowNodes.length;

    const radius =
      count <= 3 ? 2.4 :
      count <= 5 ? 2.9 :
      3.4;

    const angleStep =
      count <= 3 ? 0.22 :
      count <= 5 ? 0.30 :
      0.34;

    const baseY = 0 - rowIndex * 1.0; 
    const baseZ = -2;

    const mid = (count - 1) / 2;

    rowNodes.forEach((child, i) => {
      const card = createRoomCard({
        title: child.label,
        subtitle: "",
        imageUrl: `/images/rooms/${child.id.toLowerCase()}.png`,
        cta: "Weiter",
        onOpenRoom: () => onEnter(child, card),
        onOpen3DRoom: () => onEnter3D(child, card),
      });

      const offset = i - mid;
      const angle = offset * angleStep;

      const x = Math.sin(angle) * radius;
      const z = baseZ - Math.cos(angle) * 0.6;

      card.position.set(x, baseY, z);
      card.rotation.set(-0.05, -angle, 0);

      card.userData.node = child;
      card.userData.onEnter = () => onEnter(child, card);

      scene.add(card);
      roomCards.push(card);
    });
  }

  placeRow(firstRow, 0);
  placeRow(secondRow, 1);

  return { roomCards };
}