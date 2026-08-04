import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useProfile, useUpdateProfile } from "../hooks";

const schema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre"),
  currency: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function ProfileSection() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: profile ? { fullName: profile.fullName ?? "", currency: profile.currency } : undefined,
  });

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const onSubmit = async (values: FormValues) => {
    await updateProfile.mutateAsync({
      fullName: values.fullName,
      currency: values.currency as CurrencyCode,
    });
    reset(values);
    setSaved(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <p className="mt-1 text-sm text-muted">Tu nombre y la moneda con la que trabaja Kubo.</p>
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="fullName">
                Nombre
              </label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-xs text-negative">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="currency">
                Moneda
              </label>
              <Select id="currency" {...register("currency")}>
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} — {c.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
                <Check className="size-3.5" /> Guardado
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
