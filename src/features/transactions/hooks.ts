import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";
import { todayLocal } from "@/lib/date";
import type { TransactionKind } from "@/lib/database.types";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  kind: TransactionKind;
  occurredOn: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
}

export interface TransactionInput {
  description: string;
  amount: number;
  kind: TransactionKind;
  categoryId: string;
  occurredOn?: string;
}

/**
 * Exportada porque otras features (recurring, categories) también
 * necesitan invalidar la caché de transacciones tras sus propias
 * mutaciones — deben importar esta constante en vez de redefinirla,
 * para que un futuro cambio de key no las deje desincronizadas.
 */
export const TRANSACTIONS_KEY = "transactions";

interface RawTransaction {
  id: string;
  description: string;
  amount: number;
  kind: TransactionKind;
  occurred_on: string;
  category_id: string | null;
  categories: { name: string; icon: string } | null;
}

function mapTransaction(row: RawTransaction): Transaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    kind: row.kind,
    occurredOn: row.occurred_on,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "Otros",
    categoryIcon: row.categories?.icon ?? "circle-dollar-sign",
  };
}

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [TRANSACTIONS_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, description, amount, kind, occurred_on, category_id, categories(name, icon)")
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as RawTransaction[]).map(mapTransaction);
    },
  });
}

export function useCreateTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      if (!user) throw new Error("No autenticado");
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        description: input.description,
        amount: input.amount,
        kind: input.kind,
        category_id: input.categoryId,
        occurred_on: input.occurredOn ?? todayLocal(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TransactionInput }) => {
      const { error } = await supabase
        .from("transactions")
        .update({
          description: input.description,
          amount: input.amount,
          kind: input.kind,
          category_id: input.categoryId,
          occurred_on: input.occurredOn,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}
