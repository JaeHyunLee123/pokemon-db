"use client";

import { useParams } from "next/navigation";

export default function PokemonDetailError() {
  const { id } = useParams();
  return (
    <div className="p-2">
      {`아이디 ${id}에 해당하는 포켓몬은 존재하지 않습니다.`}
    </div>
  );
}
