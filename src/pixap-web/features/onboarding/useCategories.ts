import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { queryKeys } from "@/pixap-web/shared/api/queryKeys";

export interface CategoryRow {
  id: string;
  name: string;
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list,
    queryFn: async (): Promise<CategoryRow[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60_000,
  });
}
