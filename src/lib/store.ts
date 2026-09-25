import { create } from "zustand";
import { persist } from "zustand/middleware";
import { describeContent } from "./qr/encoders";
import {
  DEFAULT_DESIGN,
  DEFAULT_DRAFTS,
  type ContentType,
  type HistoryEntry,
  type QrContent,
  type QrDesign,
} from "./qr/types";
import { createId } from "./utils";

const HISTORY_LIMIT = 50;

interface QrStore {
  activeType: ContentType;
  drafts: Record<ContentType, QrContent>;
  design: QrDesign;
  history: HistoryEntry[];
  setActiveType: (type: ContentType) => void;
  setContent: (content: QrContent) => void;
  updateDesign: (patch: Partial<QrDesign>) => void;
  saveToHistory: (name?: string) => void;
  loadEntry: (id: string) => void;
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
  resetAll: () => void;
}

export const useQrStore = create<QrStore>()(
  persist(
    (set, get) => ({
      activeType: "url",
      drafts: DEFAULT_DRAFTS,
      design: DEFAULT_DESIGN,
      history: [],
      setActiveType: (activeType) => set({ activeType }),
      setContent: (content) =>
        set((state) => ({ drafts: { ...state.drafts, [content.type]: content } })),
      updateDesign: (patch) => set((state) => ({ design: { ...state.design, ...patch } })),
      saveToHistory: (name) => {
        const { activeType, drafts, design, history } = get();
        const content = drafts[activeType];
        const entry: HistoryEntry = {
          id: createId(),
          name: name?.trim() || describeContent(content),
          createdAt: Date.now(),
          config: { content, design },
        };
        set({ history: [entry, ...history].slice(0, HISTORY_LIMIT) });
      },
      loadEntry: (id) => {
        const entry = get().history.find((item) => item.id === id);
        if (!entry) return;
        const { content, design } = entry.config;
        set((state) => ({
          activeType: content.type,
          drafts: { ...state.drafts, [content.type]: content },
          design,
        }));
      },
      deleteEntry: (id) =>
        set((state) => ({ history: state.history.filter((item) => item.id !== id) })),
      clearHistory: () => set({ history: [] }),
      resetAll: () => set({ activeType: "url", drafts: DEFAULT_DRAFTS, design: DEFAULT_DESIGN }),
    }),
    {
      name: "qr-code-studio",
      version: 1,
      partialize: (state) => ({
        activeType: state.activeType,
        drafts: state.drafts,
        design: state.design,
        history: state.history,
      }),
    },
  ),
);
