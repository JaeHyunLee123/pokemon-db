import { useState, useCallback } from "react";
import { getRandomPokemons } from "@/libs/utils";

export type QuizStatus = "idle" | "playing" | "result";

export interface RoundResult {
  round: number;
  targetName: string;
  submittedName: string; // 시간 초과 등으로 아무것도 안 적었을 때는 빈 문자열
  isCorrect: boolean;
}

export default function useSpeedQuiz(
  totalRounds: number = 10,
  maxPokemonId: number = 151,
) {
  const [status, setStatus] = useState<QuizStatus>("idle");
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [pokemonsToGuess, setPokemonsToGuess] = useState<string[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);

  // 1. 게임 시작 (초기화)
  const startGame = useCallback(() => {
    const randomNames = getRandomPokemons(totalRounds, maxPokemonId);
    setPokemonsToGuess(randomNames);
    setCurrentRound(1);
    setResults([]);
    setStatus("playing");
  }, [totalRounds, maxPokemonId]);

  // 2. 라운드 채점 및 다음 단계 진행
  const submitAnswer = useCallback(
    (submittedName: string) => {
      if (status !== "playing") return;

      const targetName = pokemonsToGuess[currentRound - 1];
      // 제출한 이름과 실제 포켓몬 이름 비교 (공백 제거 후 비교 등)
      const normalize = (str: string) =>
        str
          .trim()
          .replace(/[^a-zA-Z0-9\u3131-\uD79D]/g, "")
          .toLowerCase();
      const isCorrect = normalize(targetName) === normalize(submittedName);

      setResults((prev) => [
        ...prev,
        {
          round: currentRound,
          targetName,
          submittedName: submittedName.trim(),
          isCorrect,
        },
      ]);

      if (currentRound >= totalRounds) {
        setStatus("result");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    },
    [status, currentRound, pokemonsToGuess, totalRounds],
  );

  // 3. 재시작
  const restartGame = useCallback(() => {
    setStatus("idle");
    setCurrentRound(1);
    setResults([]);
    setPokemonsToGuess([]);
  }, []);

  const currentPokemonName = pokemonsToGuess[currentRound - 1] || "";
  const correctCount = results.filter((r) => r.isCorrect).length;

  return {
    status,
    currentRound,
    totalRounds,
    pokemonsToGuess,
    currentPokemonName,
    results,
    correctCount,
    startGame,
    submitAnswer,
    restartGame,
  };
}
