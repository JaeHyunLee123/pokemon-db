import Link from "next/link";

export default function TestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-1 items-center">
      {children}
      <Link href={"/test"} className="block">
        테스트 홈
      </Link>
    </div>
  );
}
