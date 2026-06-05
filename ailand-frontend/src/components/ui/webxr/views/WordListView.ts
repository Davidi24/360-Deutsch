import * as THREE from "three";
import { createWordCard } from "../cards/WordCard";
import type { ARNode } from "@/components/ui/webxr/core/arTypes";

export function buildWordView(
  scene: THREE.Scene,
  anchorCard: THREE.Group,
  node: ARNode,
  onEnterWord: (child: ARNode, card: THREE.Group) => void
) {
  const wordCards: THREE.Group[] = [];

  anchorCard.position.set(0, 2.2, -1.8);
  anchorCard.rotation.set(-0.05, 0, 0);

  const words = (node.children ?? []).slice(0, 20);
  const count = words.length;

  const rows =
    count <= 8 ? 1 :
      count <= 14 ? 2 :
        3;

  const perRow = Math.ceil(count / rows);

  const chunks: ARNode[][] = [];
  for (let i = 0; i < count; i += perRow) {
    chunks.push(words.slice(i, i + perRow));
  }

  function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  function placeRow(rowWords: ARNode[], rowIndex: number) {
    const rowCount = rowWords.length;

    const radius = clamp(2.2 + rowCount * 0.08, 2.4, 3.8);
    const angleStep = clamp(0.38 - rowCount * 0.015, 0.18, 0.34);

    const baseY = 0.25 - rowIndex * 0.65;
    const baseZ = -2.25;

    const mid = (rowCount - 1) / 2;

    rowWords.forEach((child, i) => {
      const card = createWordCard({
        word: child.label,
        article: child.gender,
        ipa: child.ipa,
        imageUrl: `/images/objects/${child.id.toLowerCase()}.png`,
        cta: "WEITER",
      });

      const offset = i - mid;
      const angle = offset * angleStep;

      const x = Math.sin(angle) * radius;
      const z = baseZ - Math.cos(angle) * 0.45;

      card.position.set(x, baseY, z);
      card.rotation.set(-0.05, -angle, 0);

      card.userData.node = child;
      card.userData.onEnter = () => onEnterWord(child, card);

      const cta = card.getObjectByName("cta");
      if (cta) {
        cta.userData.onEnter = () => onEnterWord(child, card);
      }

      scene.add(card);
      wordCards.push(card);
    });
  }

  chunks.forEach((row, idx) => placeRow(row, idx));

  return { wordCards };
}