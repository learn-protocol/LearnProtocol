import { create } from "zustand";

/// Mandatory States ///
export interface IUser {
    ocid: string;
    wallet: string;
    balance: number;
    verified: boolean;
    avatar?: string | null;
}

type Status = "loading" | "idle";

interface IUserStore {
    user: IUser | null;
    status: Status;
    setUser: (user: IUser) => void;
    logout: () => void;
    setStatus: (status: Status) => void;
}

export const useUserStore = create<IUserStore>(set => ({
    user: null,
    status: "loading",
    setUser: user => set({ user }),
    logout: () => set({ user: null }),
    setStatus: status => set({ status }),
}));

/// Design-related States ///
interface AnswerTextarea {
    triggerOutline: boolean;
    setTriggerOutline: (trigger: boolean) => void;
}

export const useAnswerTextareaStore = create<AnswerTextarea>(set => ({
    triggerOutline: false,
    setTriggerOutline: triggerOutline => set({ triggerOutline }),
}));
