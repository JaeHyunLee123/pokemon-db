"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import useSpeedQuizTimer from "@/hooks/useSpeedQuizTimer";

interface SpeedQuizPlayingProps {
  currentRound: number;
  totalRounds: number;
  isAllLoaded: boolean;
  pokemonUrl: string | undefined;
  submitAnswer: (answer: string) => void;
  timeLimit: number;
}

export default function SpeedQuizPlaying({
  currentRound,
  totalRounds,
  isAllLoaded,
  pokemonUrl,
  submitAnswer,
  timeLimit,
}: SpeedQuizPlayingProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeOver = useCallback(() => {
    submitAnswer("");
    setInputValue("");
  }, [submitAnswer]);

  const isTimerActive = isAllLoaded;

  const { timeLeft, resetTimer } = useSpeedQuizTimer(
    timeLimit,
    isTimerActive,
    handleTimeOver,
  );

  useEffect(() => {
    if (isTimerActive) {
      resetTimer();
      inputRef.current?.focus();
    }
  }, [currentRound, isTimerActive, resetTimer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isTimerActive) return;
    submitAnswer(inputValue);
    setInputValue("");
  };

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg flex flex-col items-center max-w-3xl w-full relative">
        {/* Progress / Round Indicator */}
        <div className="w-full flex justify-between items-center mb-3 text-sm font-bold text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded">
            Round {currentRound} / {totalRounds}
          </span>
          <span className="text-red-500 font-extrabold text-lg flex items-center gap-1">
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Progress Bar (Visual) */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
          />
        </div>

        {/* Pokemon Image Area */}
        <div className="w-full h-80 sm:h-[28rem] bg-gray-50 rounded-lg flex items-center justify-center mb-6 shadow-inner border border-gray-100 relative">
          {!isAllLoaded ? (
            <span className="text-gray-400 text-sm font-medium animate-pulse">
              포켓몬 데이터 준비 중...
            </span>
          ) : pokemonUrl ? (
            <Image
              src={pokemonUrl}
              alt="포켓몬 이미지"
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          ) : (
            <span className="text-gray-400 text-sm font-medium">
              이미지 없음
            </span>
          )}
        </div>

        {/* Input Form */}
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isTimerActive}
            placeholder={isTimerActive ? "포켓몬 이름 입력..." : "준비중..."}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition shadow-sm disabled:opacity-50"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!isTimerActive || !inputValue.trim()}
            className="font-bold px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            제출
          </Button>
        </form>
      </div>
    </main>
  );
}
