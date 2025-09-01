import { OverallState } from "../types/state.js";

export const removeDuplicates = async (s: typeof OverallState.State) => {
  console.log("[Stage 1.1] Removing duplicates...");
  const seen = new Set<string>();
  const prepped = (s.rawItems || []).filter((x) => {
    if (seen.has(x.adgroupName)) {
      return false;
    }
    return true;
  });
  
  return { preppedItems: prepped, events: [`dedup: ${prepped.length}`] };
};

export const filterBlacklisted = async (state: typeof OverallState.State) => {
  console.log("[Stage 1.2] Filtering blacklisted items...");
  const bl = new Set(state.blacklist || []);
  
  const filtered = (state.preppedItems || []).filter((x) => {
    const isBlocked = bl.has(x.adgroupName) || bl.has((x.adgroupName || "").toLowerCase());
    return !isBlocked;
  });
  
  return { preppedItems: filtered, events: [`blacklist filtered: ${filtered.length} remaining`] };
};