import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { isSupabaseConfigured } from './lib/supabase.ts'
import { SupabaseSetupNotice } from './components/shared/SupabaseSetupNotice.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSupabaseConfigured ? <App /> : <SupabaseSetupNotice />}
  </StrictMode>,
)
