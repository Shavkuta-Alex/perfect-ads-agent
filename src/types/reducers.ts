export const reducers = {
  teamResults: {
    reducer: (a = {}, b = {}) => ({ ...a, ...b }),
  },
  finalAdGroups: {
    reducer: (a = [], b = []) => a.concat(b),
  },
  events: {
    reducer: (a = [], b = []) => a.concat(b).slice(-5000),
  },
  candidates: {
    reducer: (a = { headlines: [], descriptions: [], callouts: [] }, b = { headlines: [], descriptions: [], callouts: [] }) => ({
      headlines: a.headlines.concat(b.headlines),
      descriptions: a.descriptions.concat(b.descriptions),
      callouts: a.callouts.concat(b.callouts),
    }),
  },
};