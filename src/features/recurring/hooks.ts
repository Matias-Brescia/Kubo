import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";
import type { RecurringFrequency, TransactionKind } from "@/lib/database.types";

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  kind: TransactionKind;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  frequency: RecurringFrequency;
  nextOccurrence: string;
  isActive: boolean;
}

export interface RecurringInput {
  description: string;
  amount: number;
  kind: TransactionKind;
  categoryId: string;
  frequency: RecurringFrequency;
  startDate: string;
}

const RECURRING_KEY = "recurring-transactions";
const TRANSACTIONS_KEY = "transactions";

interface RawRecurring {
  id: string;
  description: string;
  amount: number;
  kind: TransactionKind;
  category_id: string | null;
  categories: { name: string; icon: string } | null;
  frequency: RecurringFrequency;
  next_occurrence: string;
  is_active: boolean;
}

function mapRecurring(row: RawRecurring): RecurringTransaction {
  return {
    id: row.id,
    description: row.description,
    amount: row.amount,
    kind: row.kind,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? "Otros",
    categoryIcon: row.categories?.icon ?? "circle-dollar-sign",
    frequency: row.frequency,
    nextOccurrence: row.next_occurrence,
    isActive: row.is_active,
  };
}

export function useRecurringTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [RECURRING_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<RecurringTransaction[]> => {
      const { data, error } = await supabase
        .from("recurring_transactions")
        .select(
          "id, description, amount, kind, category_id, categories(name, icon), frequency, next_occurrence, is_active"
        )
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as RawRecurring[]).map(mapRecurring);
    },
  });
}

export function useCreateRecurring() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RecurringInput) => {
      if (!user) throw new Error("No autenticado");
      const { error } = await supabase.from("recurring_transactions").insert({
        user_id: user.id,
        description: input.description,
        amount: input.amount,
        kind: input.kind,
        category_id: input.categoryId,
        frequency: input.frequency,
        next_occurrence: input.startDate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECURRING_KEY] });
    },
  });
}

export function useToggleRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("recurring_transactions")
        .update({ is_active: isActive })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECURRING_KEY] });
    },
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recurring_transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECURRING_KEY] });
    },
  });
}

function advance(date: Date, frequency: RecurringFrequency): Date {
  const next = new Date(date);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  else if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  else next.setFullYear(next.getFullYear() + 1);
  return next;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Al abrir la app, revisa los recurrentes activos y, por cada uno cuya
 * `next_occurrence` ya llegó (o quedó atrás), crea la transacción real
 * y avanza la fecha hasta que quede en el futuro. Como Kubo no corre un
 * cron en el servidor, esto es lo que "dispara" los recurrentes — basta
 * con que el usuario abra la app una vez al día para que no se acumulen.
 */
export function useRunDueRecurringTransactions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: recurring } = useRecurringTransactions();

  useEffect(() => {
    if (!user || !recurring || recurring.length === 0) return;

    const due = recurring.filter((r) => r.isActive && new Date(r.nextOccurrence) <= new Date());
    if (due.length === 0) return;

    (async () => {
      for (const item of due) {
        let occurrence = new Date(item.nextOccurrence);
        const rowsToInsert: { occurred_on: string }[] = [];

        while (occurrence <= new Date()) {
          rowsToInsert.push({ occurred_on: toIsoDate(occurrence) });
          occurrence = advance(occurrence, item.frequency);
        }

        if (rowsToInsert.length === 0) continue;

        const { error: insertError } = await supabase.from("transactions").insert(
          rowsToInsert.map((row) => ({
            user_id: user.id,
            description: item.description,
            amount: item.amount,
            kind: item.kind,
            category_id: item.categoryId,
            occurred_on: row.occurred_on,
          }))
        );
        if (insertError) continue;

        await supabase
          .from("recurring_transactions")
          .update({ next_occurrence: toIsoDate(occurrence) })
          .eq("id", item.id);
      }

      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [RECURRING_KEY] });
    })();
    // Solo debe correr cuando cambia la lista de recurrentes (no en cada render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurring, user]);
}
