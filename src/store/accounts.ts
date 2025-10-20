"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "../lib/utils";

export type Role = "applicant" | "admin";

export type Account = {
id: string;
name: string;
email: string; // normalized (lowercase)
password: string; // demo only — don't store plaintext in real apps
role: Role;
};

export type AccountsState = {
accounts: Account[];
create: (a: Omit<Account, "id">) => Account | "exists";
findByEmail: (email: string) => Account | undefined;
verify: (email: string, password: string) => Account | null;
ensureAdmin: () => void;
};

function normalize(email: string) {
return email.trim().toLowerCase();
}

export const useAccountsStore = create<AccountsState>()(
persist(
(set, get) => ({
accounts: [],
create: (a) => {
const email = normalize(a.email);
if (get().accounts.some((acc) => acc.email === email)) return "exists";
const account: Account = { ...a, id: uid(), email };
set((state) => ({ accounts: [account, ...state.accounts] }));
return account;
},
findByEmail: (email) => get().accounts.find((a) => a.email === normalize(email)),
verify: (email, password) => {
const acc = get().accounts.find((a) => a.email === normalize(email));
if (!acc) return null;
return acc.password === password ? acc : null;
},
ensureAdmin: () => {
const email = "admin@veridia.com";
if (!get().accounts.find((a) => a.email === email)) {
const admin: Account = {
id: uid(),
name: "Admin",
email,
password: "Admin123",
role: "admin",
};
set((state) => ({ accounts: [admin, ...state.accounts] }));
}
},
}),
{ name: "veridia-accounts" }
)
);