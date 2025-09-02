import type { Candidates, FinalAdGroup, TeamOutput } from "./state.js";

export const reducers = {
  teamResults: {
    reducer: (a: Record<string, TeamOutput> = {}, b: Record<string, TeamOutput> = {}) => ({ ...a, ...b }),
  },
  finalAdGroups: {
    reducer: (a: FinalAdGroup[] = [], b: FinalAdGroup[] = []) => a.concat(b),
  },
  events: {
    reducer: (a: string[] = [], b: string[] = []) => a.concat(b).slice(-5000),
  },
  candidates: {
    reducer: (a: Candidates = { headlines: [], descriptions: [], callouts: [] }, b: Candidates = { headlines: [], descriptions: [], callouts: [] }) => ({
      headlines: a.headlines.concat(b.headlines),
      descriptions: a.descriptions.concat(b.descriptions),
      callouts: a.callouts.concat(b.callouts),
    }),
  },
};