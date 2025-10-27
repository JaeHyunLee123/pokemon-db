import { create } from "zustand";

interface SearchState {
  search: string;
  setSearch: (newSearch: string) => void;
}

const useSearchStore = create<SearchState>()((set) => ({
  search: "",
  setSearch: (newSearch) => set(() => ({ search: newSearch })),
}));

export default useSearchStore;
