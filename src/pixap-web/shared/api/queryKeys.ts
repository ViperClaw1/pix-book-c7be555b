// Centralized React Query keys. Mirror native app structure as phases land.
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
    byId: (id: string) => ["profile", id] as const,
  },
  businessCards: {
    list: (type?: string, city?: string) =>
      ["business-cards", { type, city }] as const,
    byId: (id: string) => ["business-cards", id] as const,
  },
  categories: {
    list: ["categories"] as const,
  },
} as const;
