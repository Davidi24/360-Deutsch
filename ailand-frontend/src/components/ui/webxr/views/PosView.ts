import * as THREE from "three";
import { createPosCard } from "../cards/PosCard";
import { posConfigs, posLabelToType, PosType } from "../config/pos.config";
import type { ARNode } from "@/components/ui/webxr/core/arTypes";

export function buildPosView(
  scene: THREE.Scene,
  node: ARNode,
  onEnter: (child: ARNode, card: THREE.Group) => void
) {
  const posCards: THREE.Group[] = [];
  const children = node.children ?? [];
  const count = children.length;

  const useAutoLayout = count > 0 && count < 5;

  const baseY = 0;
  const baseZ = -2.2;

  const radius =
    count <= 2 ? 1.5 :
      count === 3 ? 2.0 :
        2.2;

  const angleStep =
    count === 2 ? 0.55 :
      count === 3 ? 0.40 :
        0.34;

  const mid = (count - 1) / 2;

  children.forEach((child, index) => {
    const type: PosType = posLabelToType[child.label] ?? "noun";
    const cfg = posConfigs.find(x => x.type === type);

    const card = createPosCard({
      title: cfg?.title ?? child.label,
      subtitle: cfg?.subtitle ?? "",
      iconUrl: cfg?.iconUrl ?? "/images/pos/nomen.png",
      cta: "ÖFFNEN",
    });

    let pos: { x: number; y: number; z: number };
    let rot: { x: number; y: number; z: number };

    if (useAutoLayout) {
      const offset = index - mid;
      const angle = offset * angleStep;

      pos = {
        x: Math.sin(angle) * radius,
        y: baseY,
        z: baseZ - Math.cos(angle) * 0.35,
      };

      rot = {
        x: -0.05,
        y: -angle,
        z: 0,
      };
    } else {
      pos = cfg?.position ?? { x: -0.6 + index * 0.6, y: 0, z: -2 };
      rot = cfg?.rotation ?? { x: 0, y: 0, z: 0 };
    }

    card.position.set(pos.x, pos.y, pos.z);
    card.rotation.set(rot.x, rot.y, rot.z);

    card.userData.node = child;
    card.userData.onEnter = () => onEnter(child, card);

    scene.add(card);
    posCards.push(card);
  });

  return { posCards };
}