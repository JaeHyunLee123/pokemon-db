"use client";

import { useState } from "react";
import useSpeedQuiz from "@/hooks/useSpeedQuiz";
import useGetPokemonsByNames from "@/hooks/api/useGetPokemonsByNames";
import SpeedQuizIdle, {
  DifficultyLevel,
  DIFFICULTY_MAP,
} from "@/components/speed-quiz/SpeedQuizIdle";
import SpeedQuizPlaying from "@/components/speed-quiz/SpeedQuizPlaying";
import SpeedQuizResult from "@/components/speed-quiz/SpeedQuizResult";

const SPEED_QUIZ_ROUNDS = 10;
const SPEED_QUIZ_TIMER = 10;

export default function SpeedQuizPage() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("EASY");

  const {
    status,
    currentRound,
    totalRounds,
    pokemonsToGuess,
    correctCount,
    results,
    startGame,
    submitAnswer,
    restartGame,
  } = useSpeedQuiz(SPEED_QUIZ_ROUNDS, DIFFICULTY_MAP[difficulty].id);

  // 진행에 필요한 전체 라운드의 포켓몬 데이터를 시작 시 병렬로 한 번에 페칭 (분리된 커스텀 훅 내장)
  const { pokemonQueries, isAllLoaded } =
    useGetPokemonsByNames(pokemonsToGuess);

  // 현재 라운드 포켓몬 데이터
  const currentPokemonQuery = pokemonQueries[currentRound - 1];
  const pokemon = currentPokemonQuery?.data;

  // 결과창에서 이미지를 찾기 위한 헬퍼 함수
  const getImageUrl = (targetName: string) => {
    const targetPokemon = pokemonQueries.find(
      (q) => q.data?.name === targetName,
    )?.data;
    return targetPokemon?.frontImageUrl || "";
  };

  if (status === "idle") {
    return (
      <SpeedQuizIdle
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        startGame={startGame}
        totalRounds={SPEED_QUIZ_ROUNDS}
        timeLimit={SPEED_QUIZ_TIMER}
      />
    );
  }

  if (status === "playing") {
    return (
      <SpeedQuizPlaying
        currentRound={currentRound}
        totalRounds={totalRounds}
        isAllLoaded={isAllLoaded}
        pokemonUrl={pokemon?.frontImageUrl}
        submitAnswer={submitAnswer}
        timeLimit={SPEED_QUIZ_TIMER}
      />
    );
  }

  return (
    <SpeedQuizResult
      correctCount={correctCount}
      totalRounds={totalRounds}
      results={results}
      getImageUrl={getImageUrl}
      restartGame={restartGame}
    />
  );
}
