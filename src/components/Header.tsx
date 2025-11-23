"use client";

import Button from "@/components/common/Button";
import PokemonSearchInput from "@/components/PokemonSearchInput";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  //TODO: 실제 로그인 상태에 연결
  const [isLoggedIn] = useState(false);

  const pathname = usePathname();

  return (
    <header className="sticky w-full">
      <div className="bg-red-500 h-14" />
      <div className="bg-black h-14 flex items-center justify-between w-full">
        <div className="w-[33%]" />

        <Link href={"/"} className="w-[33%] flex items-center justify-center">
          <h1 className="text-white font-semibold text-2xl">포켓몬 DB</h1>
        </Link>

        {isLoggedIn ? (
          <div className="w-[33%] flex items-center justify-end gap-2 pr-2">
            <Button>로그아웃</Button>
          </div>
        ) : (
          <div className="w-[33%] flex items-center justify-end gap-2 pr-2">
            <Link href={"/login"} aria-label="login-page">
              <Button>로그인</Button>
            </Link>
            <Link href={"/sign-up"} aria-label="sign-up-page">
              <Button>회원가입</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="bg-white h-14 flex justify-center items-center px-1">
        {pathname === "/" && <PokemonSearchInput />}
      </div>
    </header>
  );
}
