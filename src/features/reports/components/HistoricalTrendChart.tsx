import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/currency";
import { useCurrency } from "@/app/providers/CurrencyProvider";
import type { HistoricalPoint } from "../utils";

function HistoricalTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  const { formatCurrency } = useCurrency();
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    income: "Ingresos",
    expense: "Gastos",
  };
  return (
    <div className="rounded-kubo-sm border border-border bg-surface px-3 py-2.5 text-xs shadow-kubo-lg">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono tabular-nums text-muted">
          {labels[entry.dataKey] ?? entry.dataKey}:{" "}
          <span className={entry.dataKey === "income" ? "text-accent" : "text-negative"}>
            {formatCurrency(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function HistoricalTrendChart({ data }: { data: HistoricalPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Histórico</CardTitle>
            <p className="mt-1 text-sm text-muted">Últimos {data.length} meses</p>
          </div>
          <div className="flex items-center gap-4 pt-0.5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent opacity-80" /> Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-negative opacity-80" /> Gastos
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" strokeOpacity={0.6} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted))", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted))", fontSize: 12 }}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={40}
            />
            <Tooltip content={<HistoricalTooltip />} cursor={{ fill: "hsl(var(--surface-hover))" }} />
            <Bar dataKey="income" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={18} animationDuration={200} />
            <Bar dataKey="expense" fill="hsl(var(--negative))" radius={[4, 4, 0, 0]} maxBarSize={18} animationDuration={200} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
