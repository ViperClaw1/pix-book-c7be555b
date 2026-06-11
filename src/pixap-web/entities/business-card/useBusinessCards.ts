import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { queryKeys } from "@/pixap-web/shared/api/queryKeys";
import type { BusinessCard, BusinessCardType } from "./types";

interface Filters {
  type?: BusinessCardType;
  city?: string;
  categoryId?: string;
}

const SELECT_COLS =
  "id, name, image, category_id, address, rating, tags, description, booking_price, type, phone";

/** Single-page fetch — used for Featured / Tonight horizontal sections. */
export function useBusinessCards(filters: Filters = {}, limit = 12) {
  const { type, city, categoryId } = filters;
  return useQuery({
    queryKey: [...queryKeys.businessCards.list(type, city), { categoryId, limit }],
    queryFn: async (): Promise<BusinessCard[]> => {
      let q = supabase
        .from("business_cards")
        .select(SELECT_COLS)
        .order("rating", { ascending: false })
        .limit(limit);
      if (type) q = q.eq("type", type);
      if (city) q = q.ilike("address", `%${city}%`);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as BusinessCard[];
    },
    staleTime: 60_000,
  });
}

/** Infinite scroll for the "Recommended" vertical list. */
export function useRecommendedInfinite(city?: string, categoryId?: string, pageSize = 10) {
  return useInfiniteQuery({
    queryKey: [
      ...queryKeys.businessCards.list("recommended", city),
      { categoryId, pageSize, infinite: true },
    ],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<BusinessCard[]> => {
      const from = (pageParam as number) * pageSize;
      const to = from + pageSize - 1;
      let q = supabase
        .from("business_cards")
        .select(SELECT_COLS)
        .eq("type", "recommended")
        .order("rating", { ascending: false })
        .range(from, to);
      if (city) q = q.ilike("address", `%${city}%`);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as BusinessCard[];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length,
    staleTime: 60_000,
  });
}
