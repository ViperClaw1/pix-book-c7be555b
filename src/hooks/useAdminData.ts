import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const useAllBookings = () =>
  useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, business_cards(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name, email");
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      return (bookings ?? []).map((b) => ({
        ...b,
        profile: profileMap.get(b.user_id) ?? null,
      }));
    },
  });

export const useAllProfiles = () =>
  useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("*");
      if (pErr) throw pErr;
      const { data: roles, error: rErr } = await supabase.from("user_roles").select("*");
      if (rErr) throw rErr;
      return profiles.map((p) => ({
        ...p,
        role: roles.find((r) => r.user_id === p.id)?.role ?? "buyer",
        roleId: roles.find((r) => r.user_id === p.id)?.id,
      }));
    },
  });

export const useAllBusinessCards = () =>
  useQuery({
    queryKey: ["admin-business-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_cards")
        .select("*, categories(id, name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Tables<"business_cards"> & { categories: { id: string; name: string } | null })[];
    },
  });

export const useAllCategories = () =>
  useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

// Mutations
export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"profiles"> }) => {
      const { error } = await supabase.from("profiles").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Upsert: delete old then insert new
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      // Delete role first, then profile
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });
};

export const useCreateBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (card: TablesInsert<"business_cards">) => {
      const { error } = await supabase.from("business_cards").insert(card);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-business-cards"] }),
  });
};

export const useUpdateBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<"business_cards"> }) => {
      const { error } = await supabase.from("business_cards").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-business-cards"] }),
  });
};

export const useDeleteBusinessCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("business_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-business-cards"] }),
  });
};

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; password: string; first_name: string; last_name: string; role: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-create-user", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });
};

// Shopping items hooks for admin detail page
export const useAdminShoppingItems = (businessCardId: string) =>
  useQuery({
    queryKey: ["admin-shopping-items", businessCardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shopping_items")
        .select("*")
        .eq("business_card_id", businessCardId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!businessCardId,
  });

export const useCreateShoppingItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<"shopping_items">) => {
      const { error } = await supabase.from("shopping_items").insert(item);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-shopping-items"] }),
  });
};

export const useDeleteShoppingItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shopping_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-shopping-items"] }),
  });
};
