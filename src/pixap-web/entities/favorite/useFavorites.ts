import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/pixap-web/shared/api/supabase/client";
import { queryKeys } from "@/pixap-web/shared/api/queryKeys";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";

/** Returns the set of business_card_ids the current user has favorited. */
export function useFavoriteIds() {
  const { user } = usePixapAuth();
  return useQuery({
    queryKey: [...queryKeys.favorites.mine, user?.id ?? "anon"],
    enabled: !!user,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from("favorites")
        .select("business_card_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((r: any) => r.business_card_id as string));
    },
    staleTime: 60_000,
  });
}

export function useToggleFavorite() {
  const { user } = usePixapAuth();
  const qc = useQueryClient();
  const key = [...queryKeys.favorites.mine, user?.id ?? "anon"];

  return useMutation({
    mutationFn: async ({
      businessCardId,
      isFavorite,
    }: {
      businessCardId: string;
      isFavorite: boolean;
    }) => {
      if (!user) throw new Error("Sign in required");
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("business_card_id", businessCardId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, business_card_id: businessCardId });
        if (error) throw error;
      }
    },
    onMutate: async ({ businessCardId, isFavorite }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<Set<string>>(key) ?? new Set<string>();
      const next = new Set(prev);
      if (isFavorite) next.delete(businessCardId);
      else next.add(businessCardId);
      qc.setQueryData(key, next);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: key });
    },
  });
}
