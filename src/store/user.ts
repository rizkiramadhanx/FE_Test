import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  token: string;
  name: string;
};

type State = {
  user: User | null;
  setUser: (e: User) => void;
  deletUser: () => void;
};

const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      setUser: (e: User) => set(() => ({ user: e })),
      deletUser: () => set(() => ({ user: null })),
    }),
    {
      name: "user",
    }
  )
);

export default useUserStore;
