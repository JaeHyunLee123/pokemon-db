"use client";

import Image from "next/image";
import Button from "@/components/common/Button";
import { RoundResult } from "@/hooks/useSpeedQuiz";

interface SpeedQuizResultProps {
  correctCount: number;
  totalRounds: number;
  results: RoundResult[];
  getImageUrl: (name: string) => string;
  restartGame: () => void;
}

export default function SpeedQuizResult({
  correctCount,
  totalRounds,
  results,
  getImageUrl,
  restartGame,
}: SpeedQuizResultProps) {
  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center max-w-3xl w-full text-center border-t-4 border-blue-500">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
          🎉 게임 종료
        </h1>

        <div className="text-7xl font-black text-blue-600 my-4 drop-shadow-sm">
          {correctCount}
          <span className="text-2xl font-bold text-gray-400">
            / {totalRounds}
          </span>
        </div>

        <div className="w-full max-h-[55vh] overflow-y-auto mb-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex flex-col gap-1 text-base text-left divide-y divide-gray-200">
          {results.map((r, i) => {
            const imageUrl = getImageUrl(r.targetName);

            return (
              <div key={i} className="flex justify-between items-center py-3">
                <div className="font-bold text-gray-800 flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-4">{i + 1}.</span>
                  <div className="relative w-16 h-16 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={r.targetName}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">No Img</span>
                    )}
                  </div>
                  <span className="text-lg">{r.targetName}</span>
                </div>
                {r.isCorrect ? (
                  <span className="text-green-500 font-extrabold flex items-center gap-1 text-lg">
                    ⭕ 정답
                  </span>
                ) : (
                  <span className="text-red-500 font-medium flex items-center gap-1 text-lg">
                    ❌
                    {r.submittedName ? (
                      <span className="line-through decoration-red-400 opacity-70">
                        {r.submittedName}
                      </span>
                    ) : (
                      "시간초과"
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <Button
          onClick={restartGame}
          className="w-full text-lg py-3 font-bold bg-gray-600 hover:bg-gray-700 transition"
        >
          다시 도전하기
        </Button>
      </div>
    </main>
  );
}
