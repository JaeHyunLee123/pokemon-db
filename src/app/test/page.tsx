import fs from "fs";
import path from "path";
import Link from "next/link";

/**
 * /app/test/page.tsx
 * 하위 폴더를 자동으로 감지하여 Link로 렌더링하는 페이지
 */
export default async function TestIndexPage() {
  const subfolders = ["pokemon-badge-test"];

  return (
    <main className="gap-2 flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">🧪 테스트 페이지 목록</h1>

      {subfolders.length === 0 ? (
        <p className="text-gray-500">하위 테스트 폴더가 없습니다.</p>
      ) : (
        <ul className="space-y-3 w-full max-w-sm">
          {subfolders.map((folder) => {
            const href = `/test/${encodeURIComponent(folder)}`;
            return (
              <li key={folder}>
                <Link
                  href={href}
                  className="block bg-white border rounded-lg shadow-sm px-4 py-2 hover:bg-blue-50 transition"
                >
                  {folder}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
