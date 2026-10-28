import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { isSupabaseConfigured } from './lib/supabase.ts'
import { SupabaseSetupNotice } from './components/shared/SupabaseSetupNotice.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx'

// Tras un nuevo despliegue, una pestaña que ya estaba abierta puede pedir un
// archivo de página (chunk) que ya no existe en el servidor. Vite avisa con este
// evento: recargamos una vez para traer la versión nueva. El límite de 10 s
// evita un bucle de recargas si el fallo es otro (p. ej. sin conexión); en ese
// caso el error sigue su curso y lo recoge el ErrorBoundary.
window.addEventListener('vite:preloadError', () => {
  const KEY = 'kubo:preload-reload'
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0)
    if (Date.now() - last < 10_000) return
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return
  }
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {isSupabaseConfigured ? <App /> : <SupabaseSetupNotice />}
    </ErrorBoundary>
  </StrictMode>,
)
