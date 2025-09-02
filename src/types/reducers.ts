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
      headlines: (b.headlines && b.headlines.length > 0) ? b.headlines : a.headlines,
      descriptions: (b.descriptions && b.descriptions.length > 0) ? b.descriptions : a.descriptions,
      callouts: (b.callouts && b.callouts.length > 0) ? b.callouts : a.callouts,
    }),
  },
};