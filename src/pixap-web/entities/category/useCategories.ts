import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { queryKeys } from "@/pixap-web/shared/api/queryKeys";

export interface Category {
  id: string;
  name: string;
  business_cards_count: number;
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, business_cards_count")
        .order("business_cards_count", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60_000,
  });
}
