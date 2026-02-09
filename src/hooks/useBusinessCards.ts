import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessCard {
  id: string;
  name: string;
  image: string;
  category_id: string | null;
  address: string;
  rating: number;
  tags: string[];
  description: string;
  booking_price: number;
  type: "featured" | "recommended";
  created_at: string;
  category?: { id: string; name: string } | null;
}

export const useBusinessCards = (type?: "featured" | "recommended") => {
  return useQuery({
    queryKey: ["business_cards", type],
    queryFn: async () => {
      let query = supabase
        .from("business_cards")
        .select("*, category:categories(id, name)")
        .order("created_at", { ascending: false });
      if (type) query = query.eq("type", type);
      const { data, error } = await query;
      if (error) throw error;
      return data as BusinessCard[];
    },
  });
};

export const useBusinessCard = (id: string) => {
  return useQuery({
    queryKey: ["business_card", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_cards")
        .select("*, category:categories(id, name)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as BusinessCard;
    },
    enabled: !!id,
  });
};

export const useBusinessCardsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["business_cards", "category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_cards")
        .select("*, category:categories(id, name)")
        .eq("category_id", categoryId);
      if (error) throw error;
      return data as BusinessCard[];
    },
    enabled: !!categoryId,
  });
};
