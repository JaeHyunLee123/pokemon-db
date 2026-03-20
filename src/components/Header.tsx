"use client";

import Button from "@/components/common/Button";
import PokemonSearchInput from "@/components/PokemonSearchInput";
import useLogout from "@/hooks/api/useLogout";
import useUser from "@/hooks/api/useUser";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: userData } = useUser();

  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  const pathname = usePathname();

  return (
    <header className="sticky w-full">
      <div className="bg-red-500 h-14" />
      <div className="bg-black py-2 flex items-center justify-between w-full flex-col sm:flex-row">
        <div className="w-0 sm:w-[33%]" />

        <Link
          href={"/"}
          className="sm:w-[33%] flex items-center justify-center"
        >
          <h1 className="text-white font-semibold text-2xl">포켓몬 DB</h1>
        </Link>

        {userData ? (
          <div className="sm:w-[33%] flex items-center justify-end gap-2 pr-2">
            <span className="text-white text-right">
              logged in with {userData.email}
            </span>
            <Link href="/mypage">
              <Button>마이페이지</Button>
            </Link>
            <Button
              disabled={isLogoutPending}
              onClick={() => {
                logout();
              }}
            >
              로그아웃
            </Button>
          </div>
        ) : (

          <div className="sm:w-[33%] flex items-center justify-end gap-2 pr-2">
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
