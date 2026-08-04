import { Topbar } from "@/components/layout/Topbar";
import { ProfileSection } from "./components/ProfileSection";
import { SecuritySection } from "./components/SecuritySection";
import { DangerZoneSection } from "./components/DangerZoneSection";

export function SettingsPage() {
  return (
    <>
      <Topbar title="Ajustes" subtitle="Tu cuenta, moneda y preferencias de Kubo." />
      <div className="mt-6 flex flex-col gap-5 px-6 pb-10 md:mt-8 md:px-10">
        <ProfileSection />
        <SecuritySection />
        <DangerZoneSection />
      </div>
    </>
  );
}
