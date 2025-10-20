"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "applicant" | "admin";
export type User = { id: string; name: string; email: string; role: UserRole };

type AuthState = {
user: User | null;
login: (u: User) => void;
logout: () => void;
};

export const useAuthStore = create<AuthState>()(
persist(
(set) => ({
user: null,
login: (user) => set({ user }),
logout: () => set({ user: null }),
}),
{ name: "veridia-auth" }
)
);