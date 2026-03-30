"use client";

import Button from "@/components/common/Button";
import { cn } from "@/libs/utils";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export const DIFFICULTY_MAP: Record<
  DifficultyLevel,
  { id: number; label: string; desc: string }
> = {
  EASY: {
    id: 151,
    label: "하 (쉬움)",
    desc: "1세대 포켓몬 선별 출현 (151마리)",
  },
  MEDIUM: {
    id: 493,
    label: "중 (보통)",
    desc: "1~4세대 포켓몬 종합 출현 (493마리)",
  },
  HARD: {
    id: 1025,
    label: "상 (어려움)",
    desc: "1~9세대 모든 포켓몬 출현 (1000마리+)",
  },
};

interface SpeedQuizIdleProps {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  startGame: () => void;
  totalRounds: number;
  timeLimit: number;
}

export default function SpeedQuizIdle({
  difficulty,
  setDifficulty,
  startGame,
  totalRounds,
  timeLimit,
}: SpeedQuizIdleProps) {
  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center max-w-md w-full text-center border-t-4 border-red-500">
        <h1 className="text-3xl font-extrabold mb-4 text-blue-600">
          ⚡ 포켓몬 스피드 퀴즈
        </h1>
        <p className="text-gray-600 mb-6 whitespace-pre-wrap leading-relaxed">
          {`빠르게 나타나는 포켓몬을 보고\n이름을 맞춰보세요!\n(총 ${totalRounds}문제 / 문제당 ${timeLimit}초 제한)`}
        </p>

        <div className="w-full flex flex-col gap-3 mb-8 text-left">
          <span className="font-bold text-gray-700 text-center text-lg mb-2">
            난이도 선택
          </span>
          {(Object.keys(DIFFICULTY_MAP) as DifficultyLevel[]).map((level) => {
            const config = DIFFICULTY_MAP[level];
            return (
              <label
                key={level}
                className={cn(
                  "flex flex-col p-4 border-2 rounded-xl cursor-pointer transition",
                  difficulty === level
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="difficulty"
                    checked={difficulty === level}
                    onChange={() => setDifficulty(level)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`font-bold text-lg ${difficulty === level ? "text-blue-700" : "text-gray-800"}`}
                  >
                    {config.label}
                  </span>
                </div>
                <span className="text-sm text-gray-600 pl-6">
                  {config.desc}
                </span>
              </label>
            );
          })}
        </div>

        <Button
          onClick={startGame}
          className="w-full text-lg py-4 font-bold bg-blue-600 hover:bg-blue-700 transition"
        >
          도전 시작!
        </Button>
      </div>
    </main>
  );
}
