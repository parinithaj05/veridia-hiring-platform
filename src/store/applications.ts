"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Application,
  ApplicationStatus,
  StatusEvent,
} from "../types/application";

type ApplicationsState = {
  applications: Application[];
  upsert: (app: Application) => void;
  changeStatus: (
    id: string,
    status: ApplicationStatus,
    note?: string,
    by?: string
  ) => void;
  forUser: (userId: string) => Application[];
  byId: (id: string) => Application | undefined;
};

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],

      upsert: (app) =>
        set((state) => {
          const idx = state.applications.findIndex((a) => a.id === app.id);
          if (idx >= 0) {
            const copy = [...state.applications];
            copy[idx] = app;
            return { applications: copy };
          }
          return { applications: [app, ...state.applications] };
        }),

      changeStatus: (id, status, note, by) =>
        set((state) => {
          const apps = state.applications.map((a) => {
            if (a.id !== id) return a;
            const event: StatusEvent = {
              status,
              at: new Date().toISOString(),
              by,
              note,
            };
            return {
              ...a,
              status,
              notes: note ?? a.notes,
              history: [...(a.history ?? []), event],
            };
          });
          return { applications: apps };
        }),

      forUser: (userId) => get().applications.filter((a) => a.userId === userId),

      byId: (id) => get().applications.find((a) => a.id === id),
    }),
    { name: "veridia-applications" }
  )
);