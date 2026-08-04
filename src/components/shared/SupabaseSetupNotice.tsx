import { Logo } from "@/components/layout/Logo";

export function SupabaseSetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-kubo border border-border bg-surface p-6 text-center shadow-kubo">
        <div className="flex justify-center">
          <Logo className="size-9" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Falta conectar Supabase</h1>
        <p className="mt-2 text-sm text-muted">
          Kubo necesita las credenciales de tu proyecto de Supabase para funcionar.
        </p>
        <ol className="mt-5 space-y-2 text-left text-sm text-muted">
          <li>1. Copia <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">.env.example</code> como <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">.env</code></li>
          <li>2. Completa <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> y <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> con los datos de Project Settings → API en tu dashboard de Supabase</li>
          <li>3. Ejecuta el script <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">supabase/schema.sql</code> en el SQL Editor de tu proyecto</li>
          <li>4. Reinicia <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs">pnpm dev</code></li>
        </ol>
      </div>
    </div>
  );
}
