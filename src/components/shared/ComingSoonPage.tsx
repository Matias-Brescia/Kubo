import type { LucideIcon } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/card";

interface ComingSoonPageProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function ComingSoonPage({ title, icon: Icon, description }: ComingSoonPageProps) {
  return (
    <>
      <Topbar title={title} subtitle="Esta sección llega en una próxima entrega." />
      <div className="px-6 pt-6 md:px-10 md:pt-8">
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
            <Icon className="size-5" />
          </div>
          <p className="text-sm font-medium">{title} está en camino</p>
          <p className="max-w-sm text-sm text-muted">{description}</p>
        </Card>
      </div>
    </>
  );
}
