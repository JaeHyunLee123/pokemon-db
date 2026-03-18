"use client";

import { useState } from "react";
import Button from "./common/Button";
import useAISearch from "@/hooks/api/useAISearch";
import Loading from "./common/Loading";
import PokemonCard from "./PokemonCard";

export default function AISearchForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { mutate: searchAI, isPending, data: searchResults } = useAISearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchAI(query);
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 w-16 h-16 bg-neutral-900 border-2 border-neutral-700 hover:bg-black outline-none text-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer"
        aria-label="AI 포켓몬 검색 열기"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* 팝업 창 */}
      {isOpen && (
        <div className="fixed bottom-28 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-neutral-900 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.7)] border border-neutral-700 z-50 overflow-hidden animate-fade-in transition-all">
          {/* Header */}
          <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-red-500">✨</span> AI 포켓몬 도우미
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                예: &quot;네 발로 걷고 풀타입인 포켓몬 찾아줘&quot;
              </p>
            </div>
            <button 
              onClick={toggleOpen}
              className="text-neutral-400 hover:text-white text-2xl h-8 w-8 rounded hover:bg-neutral-700 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          </div>

      {/* Content Area (Results or Loading) */}
      <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
        {isPending ? (
          <div className="h-full flex items-center justify-center">
            <Loading className="text-white scale-125" />
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
            {searchResults.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                className="w-48 bg-neutral-800 border-neutral-700 text-white"
              />
            ))}
          </div>
        ) : searchResults && searchResults.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col gap-4 text-neutral-400 text-lg">
            <span className="text-4xl">😢</span>
            조건에 맞는 포켓몬을 찾지 못했어요.
          </div>
        ) : (
          <div className="h-full flex items-center justify-center flex-col gap-4 text-neutral-500 text-lg">
            <span className="text-4xl text-neutral-400">🤖</span>
            어떤 포켓몬을 찾고 계신가요?
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-neutral-800 border-t border-neutral-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="포켓몬의 특징을 설명해주세요..."
            className="flex-1 bg-neutral-900 text-white rounded-lg px-4 py-3 border border-neutral-700 focus:outline-none focus:border-red-500 transition-colors"
            disabled={isPending}
          />
          <Button
            type="submit"
            disabled={isPending || !query.trim()}
            className="bg-neutral-800 border border-neutral-600 hover:bg-neutral-700 text-white font-bold rounded-lg px-4 sm:px-6 disabled:bg-neutral-800 disabled:text-neutral-500 transition-colors"
          >
            찾기
          </Button>
        </form>
      </div>
    </div>
    )}
    </>
  );
}
