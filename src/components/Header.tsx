"use client";

import Button from "@/components/common/Button";
import { MobileSidebar } from "@/components/MobileSidebar";
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
    <MobileSidebar>
      <header className="sticky top-0 z-40 w-full shadow-md">
      <div className="bg-red-500 h-10 md:h-14" />
      <div className="bg-black py-2 px-4 md:px-4 flex items-center justify-between w-full">
        {/* 좌측 영역: 데스크탑 좌측 메뉴 (스피드 퀴즈) & 모바일 빈 여백(타이틀 중앙 정렬용) */}
        <div className="flex flex-1 items-center justify-start">
          <div className="hidden md:flex">
            <Link href={"/speed-quiz"}>
              <span className="text-white bg-red-600 px-3 py-1 rounded-md text-sm font-bold shadow-md hover:bg-red-700 transition whitespace-nowrap">
                ⚡ 스피드 퀴즈
              </span>
            </Link>
          </div>
        </div>

        {/* 중앙 로고 영역 */}
        <div className="flex shrink-0 items-center justify-center px-2">
          <Link href={"/"}>
            <h1 className="text-white font-semibold text-xl md:text-2xl whitespace-nowrap">
              포켓몬 DB
            </h1>
          </Link>
        </div>

        {/* 우측 영역: 데스크탑 우측 메뉴 & 모바일 햄버거 아이콘 */}
        <div className="flex flex-1 flex-row items-center justify-end gap-3 whitespace-nowrap flex-nowrap">
          {/* 데스크탑 우측 메뉴 */}
          <div className="hidden md:flex items-center gap-3">
            {userData ? (
              <>
                <span className="text-white text-right text-sm truncate max-w-[150px] xl:max-w-[200px]">
                  {userData.email}
                </span>
                <Link href="/mypage">
                  <Button>마이페이지</Button>
                </Link>
                <Button disabled={isLogoutPending} onClick={() => logout()}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href={"/login"} aria-label="login-page">
                  <Button>로그인</Button>
                </Link>
                <Link href={"/sign-up"} aria-label="sign-up-page">
                  <Button>회원가입</Button>
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <MobileSidebar.Trigger />
        </div>
      </div>

      <div className="bg-white h-14 flex justify-center items-center px-1 border-b">
        {pathname === "/" && <PokemonSearchInput />}
      </div>

      {/* 모바일 사이드바 */}
      <MobileSidebar.Content>
        {({ close }) => (
          <>
            <Link href={"/speed-quiz"} onClick={close}>
              <span className="flex justify-center text-white bg-red-600 px-4 py-3 rounded-md text-base font-bold shadow-md hover:bg-red-700 transition">
                ⚡ 스피드 퀴즈
              </span>
            </Link>

            {userData ? (
              <div className="flex flex-col gap-3">
                <span className="text-center text-sm text-gray-600 break-all">
                  {userData.email}
                </span>
                <Link href="/mypage" className="w-full" onClick={close}>
                  <Button className="w-full ">마이페이지</Button>
                </Link>
                <Button
                  className="w-full "
                  disabled={isLogoutPending}
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href={"/login"}
                  aria-label="login-page"
                  className="w-full"
                  onClick={close}
                >
                  <Button className="w-full ">로그인</Button>
                </Link>
                <Link
                  href={"/sign-up"}
                  aria-label="sign-up-page"
                  className="w-full"
                  onClick={close}
                >
                  <Button className="w-full ">회원가입</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </MobileSidebar.Content>
    </header>
  </MobileSidebar>
  );
}
