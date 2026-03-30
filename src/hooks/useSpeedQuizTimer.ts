import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 스피드 퀴즈용 카운트다운 타이머 훅
 * @param initialTime 타이머 시작 시간 (초 단위, 기본값: 5)
 * @param isActive 타이머 활성화(진행) 여부
 * @param onTimeOver 시간이 0이 되었을 때 실행할 콜백 함수 (오답 처리 등)
 */
export default function useSpeedQuizTimer(
  initialTime: number = 5,
  isActive: boolean,
  onTimeOver: () => void,
) {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  // onTimeOver 콜백이 변경되어도 타이머가 불필요하게 리렌더링/재실행되지 않도록 참조에 보관
  const onTimeOverRef = useRef(onTimeOver);
  useEffect(() => {
    onTimeOverRef.current = onTimeOver;
  }, [onTimeOver]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeOverRef.current();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // 외부에서 다음 라운드 진입 시 타이머를 리셋하기 위한 함수
  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  return {
    timeLeft,
    resetTimer,
  };
}
