import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthProvider";
import type { CurrencyCode } from "@/lib/currency";

export interface Profile {
  fullName: string | null;
  currency: CurrencyCode;
}

const PROFILE_KEY = "profile";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [PROFILE_KEY, user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, currency")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return { fullName: data.full_name, currency: (data.currency as CurrencyCode) ?? "PEN" };
    },
    // El perfil casi no cambia; evitamos refetch agresivo.
    staleTime: 5 * 60_000,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { fullName?: string; currency?: CurrencyCode }) => {
      if (!user) throw new Error("No autenticado");
      const patch: { full_name?: string; currency?: string } = {};
      if (input.fullName !== undefined) patch.full_name = input.fullName;
      if (input.currency !== undefined) patch.currency = input.currency;
      const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
      if (error) throw error;

      // El nombre también vive en los metadatos de auth (lo usa el saludo del dashboard).
      if (input.fullName !== undefined) {
        await supabase.auth.updateUser({ data: { full_name: input.fullName } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
    },
  });
}

export function useUpdateEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
  });
}

/**
 * Elimina la cuenta del usuario por completo (perfil, datos y el registro
 * de auth). Depende de la función `delete_own_account` definida en
 * `supabase/schema.sql` — solo puede borrar al propio usuario autenticado.
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("delete_own_account");
      if (error) throw error;
      await supabase.auth.signOut();
    },
  });
}
