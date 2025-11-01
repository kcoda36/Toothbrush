import { create } from "https://esm.sh/zustand@4.5.2";
import { defaultParams } from "./params.js";

export const useParams = create((set) => ({
  ...defaultParams,
  setParam: (key, value) => set(() => ({ [key]: value })),
  reset: () => set(() => ({ ...defaultParams })),
}));
