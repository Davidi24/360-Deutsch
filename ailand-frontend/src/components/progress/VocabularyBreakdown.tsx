"use client";

import React from "react";
import type { UserProgressUI } from "@/types/progress";

type Props = {
  vocabularyProgress: UserProgressUI["vocabularyProgress"];
};

export const VocabularyBreakdown: React.FC<Props> = ({ vocabularyProgress }) => {
  const { mastered, learning, inProgress, notStarted } = vocabularyProgress;
  const total = mastered + learning + inProgress + notStarted;

  const safePercent = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const progressData = [
    { label: "Learned", value: mastered, percent: safePercent(mastered), color: "from-[#9160a8] to-[#5a47c7]" },
    { label: "Learning", value: learning, percent: safePercent(learning), color: "from-[#5a47c7] to-[#9160a8]" },
    { label: "In Progress", value: inProgress, percent: safePercent(inProgress), color: "from-[#ebc6ae] to-[#dc9b6c]" },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vocabulary Breakdown</h3>
        <div className="text-sm text-muted-foreground">{mastered + learning + inProgress} / {total} words</div>
      </div>

      <div className="space-y-4">
        {progressData.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{item.percent}%</span>
                <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">{item.value}</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-500 ease-out`}
                   style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Not Started</span>
            <span className="font-medium">~{notStarted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
