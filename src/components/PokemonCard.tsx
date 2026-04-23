import { cn } from "@/libs/utils";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, MouseEvent, useEffect, useState } from "react";
import HeartIcon from "./icons/HeartIcon";
import useAddBookmark from "@/hooks/api/useAddBookmark";
import useDeleteBookmark from "@/hooks/api/useDeleteBookmark";
import { useDebounce } from "@/hooks/useDebounce";
import useUser from "@/hooks/api/useUser";
import useToast from "@/hooks/useToast";
import posthog from "posthog-js";

interface PokemonCardProps extends Omit<ComponentProps<typeof Link>, "href"> {
  pokemon: Pokemon;
  bookmarkedPokemonIds?: number[];
}

export default function PokemonCard({
  pokemon,
  className,
  bookmarkedPokemonIds = [],
  ...props
}: PokemonCardProps) {
  const isServerBookmarked = bookmarkedPokemonIds.includes(pokemon.id);
  const [isBookmarked, setIsBookmarked] = useState(isServerBookmarked);
  const { data: user } = useUser();
  const triggerToast = useToast();

  // 서버 상태와 동기화 (최초 로드 및 뮤테이션 성공 시)
  useEffect(() => {
    setIsBookmarked(isServerBookmarked);
  }, [isServerBookmarked]);

  const [pendingAction, setPendingAction] = useState<"add" | "delete" | null>(
    null,
  );
  const debouncedAction = useDebounce(pendingAction, 300);

  const { mutate: addBookmark } = useAddBookmark();
  const { mutate: deleteBookmark } = useDeleteBookmark();

  // 디바운스된 액션이 있고, 현재 서버 상태와 다를 때만 API 호출
  useEffect(() => {
    if (debouncedAction === "add" && !isServerBookmarked) {
      addBookmark(pokemon.id);
    } else if (debouncedAction === "delete" && isServerBookmarked) {
      deleteBookmark(pokemon.id);
    }
    setPendingAction(null);
  }, [
    debouncedAction,
    addBookmark,
    deleteBookmark,
    pokemon.id,
    isServerBookmarked,
  ]);

  const handleBookmarkClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      triggerToast(
        "error",
        "로그인 필요 서비스",
        "로그인 후 북마크를 사용할 수 있습니다.",
      );

      return;
    }

    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus); // Optimistic UI (Local State)

    posthog.capture("bookmark_toggled", {
      pokemon_id: pokemon.id,
      pokemon_name: pokemon.name,
      bookmarked: newStatus,
    });

    if (newStatus !== isServerBookmarked) {
      setPendingAction(newStatus ? "add" : "delete");
    } else {
      setPendingAction(null); // 서버 상태로 돌아오면 취소
    }
  };

  return (
    <Link
      {...props}
      href={`/${pokemon.id}`}
      className={cn(
        "flex flex-col relative gap-1 overflow-hidden justify-center items-center px-8 py-10 border-b-4 border-r-4 border-gray-800 rounded-xl bg-neutral-50 cursor-pointer hover:scale-105 transition-transform",
        className,
      )}
      prefetch={false}
    >
      <div className="w-full absolute top-0">
        <div className="h-2 bg-red-500" />
        <div className="h-2 bg-black" />
      </div>

      <button
        onClick={handleBookmarkClick}
        className="absolute top-4 right-4 z-10 p-1 hover:scale-110 transition-transform cursor-pointer"
        type="button"
      >
        <HeartIcon
          isFilled={isBookmarked}
          className={cn(
            "size-7",
            isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-500",
          )}
        />
      </button>

      <Image
        src={pokemon.frontImageUrl}
        alt={`${pokemon.name}-image`}
        width={90}
        height={90}
      />

      <span className="text-lg font-medium">{pokemon.name}</span>

      <div className="w-full absolute bottom-0">
        <div className="h-2 bg-black" />
        <div className="h-2 bg-red-500" />
      </div>
    </Link>
  );
}
