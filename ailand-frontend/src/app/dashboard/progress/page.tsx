import { ProgressDashboard } from "@/components/progress/ProgressDashboard";
import { Main } from "@/components/layout/main";
import type { UserProgressUI } from "@/types/progress";

const MOCK_PROGRESS: UserProgressUI = {
  roomsCompleted: 2,
  totalRooms: 12,

  levelsCompleted: 1,

  wordsLearned: 40,
  totalWords: 300,

  dayStreak: 14,

  totalPoints: 820,
  pointsToday: 60,
  pointsThisWeek: 300,

  vocabularyProgress: {
    mastered: 25,
    learning: 15,
    inProgress: 10,
    notStarted: 250,
  },

  weeklyActivity: {
    currentWeek: 3,
    mostActiveDay: "Wednesday",
    days: [
      { day: "Mon", value: 2, date: "2024-03-11" },
      { day: "Tue", value: 5, date: "2024-03-12" },
      { day: "Wed", value: 15, date: "2024-03-13" },
      { day: "Thu", value: 3, date: "2024-03-14" },
      { day: "Fri", value: 9, date: "2024-03-15" },
      { day: "Sat", value: 1, date: "2024-03-16" },
      { day: "Sun", value: 7, date: "2024-03-17" },
    ],
  },

  levelProgress: {
    current: "A1",
    progressPercent: 35,
    overallProgressPercent: 35,
    milestones: ["A1", "A2", "B1"],
  },
};

export default function ProgressPage() {
  return (
    <Main fixed className=" pt-2">
      <ProgressDashboard initialData={MOCK_PROGRESS} />
    </Main>
  );
}