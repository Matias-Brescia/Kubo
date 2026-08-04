import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/lib/currency";
import type { TrendPoint } from "../types";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-kubo-sm border border-border bg-surface px-3 py-2 text-xs shadow-kubo-lg">
      <p className="mb-1 font-medium text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono tabular">
          {entry.dataKey === "income" ? "Ingresos: " : "Gastos: "}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function SpendingChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Tendencia</CardTitle>
          <p className="mt-1 text-sm font-medium">Ingresos vs. gastos</p>
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
      <CardContent className="h-64 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.28} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--negative))" stopOpacity={0.22} />
                <stop offset="100%" stopColor="hsl(var(--negative))" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(var(--border))" }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#incomeFill)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(var(--negative))"
              strokeWidth={2}
              fill="url(#expenseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
