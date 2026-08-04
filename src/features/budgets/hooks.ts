import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  monthlyAmount: number;
}

export interface BudgetInput {
  categoryId: string;
  monthlyAmount: number;
}

const BUDGETS_KEY = "budgets";

interface RawBudget {
  id: string;
  category_id: string;
  monthly_amount: number;
  categories: { name: string; icon: string } | null;
}

function mapBudget(row: RawBudget): Budget {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "Otros",
    categoryIcon: row.categories?.icon ?? "circle-dollar-sign",
    monthlyAmount: row.monthly_amount,
  };
}

export function useBudgets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [BUDGETS_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Budget[]> => {
      const { data, error } = await supabase
        .from("budgets")
        .select("id, category_id, monthly_amount, categories(name, icon)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as RawBudget[]).map(mapBudget);
    },
  });
}

export function useCreateBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BudgetInput) => {
      if (!user) throw new Error("No autenticado");
      const { error } = await supabase.from("budgets").insert({
        user_id: user.id,
        category_id: input.categoryId,
        monthly_amount: input.monthlyAmount,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: BudgetInput }) => {
      const { error } = await supabase
        .from("budgets")
        .update({
          category_id: input.categoryId,
          monthly_amount: input.monthlyAmount,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}
