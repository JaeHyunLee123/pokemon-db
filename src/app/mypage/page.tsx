"use client";

import Loading from "@/components/common/Loading";
import PokemonCard from "@/components/PokemonCard";
import useBookmarks from "@/hooks/api/useBookmarks";
import Link from "next/link";

export default function MyPage() {
  const { data: bookmarks, isLoading } = useBookmarks();
  const bookmarkedPokemonIds: number[] = bookmarks
    ? bookmarks.map((bookmark) => bookmark.id)
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-168px)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col items-center gap-8 min-h-[calc(100vh-168px)]">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold bg-white px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          내 북마크 도감
        </h2>
        <p className="text-gray-600 mt-2">
          북마크한 포켓몬들을 한눈에 확인하세요.
        </p>
      </div>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
          {bookmarks.map((pokemon) => (
            <div key={pokemon.id} className="flex justify-center">
              <PokemonCard
                pokemon={pokemon}
                bookmarkedPokemonIds={bookmarkedPokemonIds}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-20 p-10 bg-white border-2 border-dashed border-gray-400 rounded-xl">
          <div className="text-6xl text-gray-300">Empty</div>
          <div className="text-center">
            <p className="text-xl font-medium text-gray-700">
              아직 북마크한 포켓몬이 없습니다.
            </p>
            <p className="text-gray-500 mt-1">
              메인 페이지에서 마음에 드는 포켓몬의 하트를 눌러보세요!
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 px-6 py-2 bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600 transition-colors"
          >
            포켓몬 보러 가기
          </Link>
        </div>
      )}
    </div>
  );
}
