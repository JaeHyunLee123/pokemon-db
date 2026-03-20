import { bookmarkRepository } from "@/repositories/bookmark-repository";

export const bookmarkService = {
  async toggleBookmark(userId: number, pokemonId: number) {
    const bookmark = await bookmarkRepository.findBookmark(userId, pokemonId);

    if (bookmark) {
      await bookmarkRepository.deleteBookmark(userId, pokemonId);
      return { isBookmarked: false };
    } else {
      await bookmarkRepository.createBookmark(userId, pokemonId);
      return { isBookmarked: true };
    }
  },

  async getUserBookmarks(userId: number) {
    const bookmarks = await bookmarkRepository.findBookmarksByUserId(userId);
    // 도감 번호(id) 기준으로 중복 제거 혹은 정렬이 필요할 수 있으나, 현재는 최신 등록순으로 반환
    return bookmarks.map((b) => b.pokemon);
  },
};
