import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  image: string;
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
