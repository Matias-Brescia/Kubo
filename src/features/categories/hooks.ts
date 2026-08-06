import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";
import { TRANSACTIONS_KEY } from "@/features/transactions/hooks";
import type { CategoryKind } from "@/lib/database.types";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  icon: string;
}

const CATEGORIES_KEY = "categories";

export function useCategories() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [CATEGORIES_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, kind, icon")
        .order("name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCategory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string; kind: CategoryKind; icon?: string }) => {
      if (!user) throw new Error("No autenticado");
      const { error } = await supabase.from("categories").insert({
        user_id: user.id,
        name: input.name,
        kind: input.kind,
        icon: input.icon ?? "circle-dollar-sign",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}
