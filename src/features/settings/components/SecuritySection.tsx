import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";
import { useUpdateEmail, useUpdatePassword } from "../hooks";

const emailSchema = z.object({ email: z.string().email("Ingresa un correo válido") });
const passwordSchema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export function SecuritySection() {
  const { user } = useAuth();
  const updateEmail = useUpdateEmail();
  const updatePassword = useUpdatePassword();
  const [emailSent, setEmailSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email ?? "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (values: EmailValues) => {
    setEmailSent(false);
    await updateEmail.mutateAsync(values.email);
    setEmailSent(true);
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    setPasswordChanged(false);
    await updatePassword.mutateAsync(values.password);
    passwordForm.reset({ password: "", confirmPassword: "" });
    setPasswordChanged(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguridad</CardTitle>
        <p className="mt-1 text-sm text-muted">Correo de acceso y contraseña.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-4">
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted" htmlFor="email">
              Correo
            </label>
            <Input id="email" type="email" {...emailForm.register("email")} />
            {emailForm.formState.errors.email && (
              <p className="text-xs text-negative">{emailForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={!emailForm.formState.isDirty || updateEmail.isPending}
            >
              {updateEmail.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Cambiar correo
            </Button>
            {emailSent && (
              <span className="text-xs text-muted">
                Te enviamos un enlace de confirmación a tu correo nuevo.
              </span>
            )}
          </div>
        </form>

        <Separator />

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="password">
                Nueva contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...passwordForm.register("password")}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-negative">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-negative">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary" size="sm" disabled={updatePassword.isPending}>
              {updatePassword.isPending && <Loader2 className="size-3.5 animate-spin" />}
              Cambiar contraseña
            </Button>
            {passwordChanged && (
              <span className="text-xs text-muted">Tu contraseña se actualizó correctamente.</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
