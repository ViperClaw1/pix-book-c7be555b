import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_id: string;
  business_card_id: string;
  value: number;
  description: string;
  created_at: string;
  profile?: { first_name: string; last_name: string } | null;
}

export const useReviews = (businessCardId: string) => {
  return useQuery({
    queryKey: ["reviews", businessCardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_card_id", businessCardId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!businessCardId,
  });
};
