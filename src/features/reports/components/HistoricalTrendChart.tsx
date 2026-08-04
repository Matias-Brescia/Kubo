import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/lib/currency";
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
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    income: "Ingresos",
    expense: "Gastos",
  };
  return (
    <div className="rounded-kubo-sm border border-border bg-surface px-3 py-2 text-xs shadow-kubo-lg">
      <p className="mb-1 font-medium text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono tabular">
          {labels[entry.dataKey] ?? entry.dataKey}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function HistoricalTrendChart({ data }: { data: HistoricalPoint[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Histórico</CardTitle>
          <p className="mt-1 text-sm font-medium">Últimos {data.length} meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" /> Ingresos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-negative" /> Gastos
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
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
            <Bar dataKey="income" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="expense" fill="hsl(var(--negative))" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
