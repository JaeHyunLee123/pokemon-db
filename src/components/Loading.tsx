"use client";

import { cn } from "@/libs/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const LOADING_IMAGE_SIZE = 120;
const BASE_LOADING_TEXT = "Loading .";
const INTERVAL_MS = 700;

interface LoadingProps {
  className?: string;
}

export default function Loading({ className = "" }: LoadingProps) {
  //찌리리공 이미지
  const imageUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png";

  const [loadingText, setLoadingText] = useState(BASE_LOADING_TEXT);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) =>
        prev === BASE_LOADING_TEXT + ".." ? BASE_LOADING_TEXT : prev + "."
      );
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 justify-center items-center",
        className
      )}
    >
      <Image
        src={imageUrl}
        alt="loading-image"
        width={LOADING_IMAGE_SIZE}
        height={LOADING_IMAGE_SIZE}
        className="animate-spin"
      />
      <span>{loadingText}</span>
    </div>
  );
}
