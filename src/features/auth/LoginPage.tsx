import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";

const schema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setFormError(error);
      return;
    }
    const from = (location.state as { from?: string })?.from ?? "/";
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para ver tus finanzas."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-accent hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted" htmlFor="email">
            Correo
          </label>
          <Input id="email" type="email" autoFocus placeholder="tu@correo.com" {...register("email")} />
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
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  );
}
