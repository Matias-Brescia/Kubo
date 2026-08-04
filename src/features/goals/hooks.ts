import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
}

export interface GoalInput {
  name: string;
  icon: string;
  targetAmount: number;
  targetDate?: string | null;
}

const GOALS_KEY = "goals";

interface RawGoal {
  id: string;
  name: string;
  icon: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

function mapGoal(row: RawGoal): Goal {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    targetAmount: row.target_amount,
    currentAmount: row.current_amount,
    targetDate: row.target_date,
  };
}

export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [GOALS_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Goal[]> => {
      const { data, error } = await supabase
        .from("goals")
        .select("id, name, icon, target_amount, current_amount, target_date")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as RawGoal[]).map(mapGoal);
    },
  });
}

export function useCreateGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GoalInput) => {
      if (!user) throw new Error("No autenticado");
      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        name: input.name,
        icon: input.icon,
        target_amount: input.targetAmount,
        target_date: input.targetDate ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: GoalInput }) => {
      const { error } = await supabase
        .from("goals")
        .update({
          name: input.name,
          icon: input.icon,
          target_amount: input.targetAmount,
          target_date: input.targetDate ?? null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
    },
  });
}

/**
 * Registra un aporte (o retiro, con `amount` negativo) a la meta.
 * Como no existe una tabla de contribuciones separada, se lee el
 * valor actual y se escribe el nuevo total directamente.
 */
export function useContributeToGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goal, amount }: { goal: Goal; amount: number }) => {
      const nextAmount = Math.max(goal.currentAmount + amount, 0);
      const { error } = await supabase
        .from("goals")
        .update({ current_amount: nextAmount })
        .eq("id", goal.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
    },
  });
}
