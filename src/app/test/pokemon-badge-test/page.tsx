import TypeBadge from "@/components/TypeBadge";
import { POKEMON_TYPE_KR } from "@/constants";

export default function TypeBadgeTest() {
  // 모든 타입 key 가져오기 + 테스트용 잘못된 값 추가
  const allTypes = [...Object.keys(POKEMON_TYPE_KR), "unknown-type"];

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">포켓몬 타입 뱃지 테스트</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {allTypes.map((type) => (
          <div
            key={type}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-sm"
          >
            <TypeBadge type={type} size="md" />
            <p className="text-xs text-gray-600">
              <code>{type}</code>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-sm text-gray-500">
        ✅ 올바른 타입은 색상과 한글 이름이 표시되고,
        <br />❌ 존재하지 않는 타입은 <strong>“알 수 없음”</strong>으로
        표시됩니다.
      </div>
    </div>
  );
}
