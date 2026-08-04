import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";

const schema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const { error } = await signUp(values.email, values.password, values.fullName);
    if (error) {
      setFormError(error);
      return;
    }
    setConfirmationSent(true);
  };

  if (confirmationSent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un enlace de confirmación."
        footer={
          <Link to="/login" className="font-medium text-accent hover:underline">
            Volver a iniciar sesión
          </Link>
        }
      >
        <p className="text-center text-sm text-muted">
          Confirma tu cuenta desde el correo que te enviamos para empezar a usar Kubo.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a registrar tus finanzas en segundos."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="fullName">
            Nombre
          </label>
          <Input id="fullName" autoFocus placeholder="Matías Pérez" {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-negative">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="email">
            Correo
          </label>
          <Input id="email" type="email" placeholder="tu@correo.com" {...register("email")} />
          {errors.email && <p className="text-xs text-negative">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="password">
            Contraseña
          </label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-negative">{errors.password.message}</p>}
        </div>

        {formError && (
          <p className="rounded-kubo-sm bg-negative/10 px-3 py-2 text-xs text-negative">
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
