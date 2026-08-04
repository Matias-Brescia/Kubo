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
import { formatCompactNumber } from "@/lib/currency";
import { useCurrency } from "@/app/providers/CurrencyProvider";
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
  const { formatCurrency } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-kubo-sm border border-border bg-surface px-3 py-2.5 text-xs shadow-kubo-lg">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono tabular-nums text-muted">
          {entry.dataKey === "income" ? "Ingresos: " : "Gastos: "}
          <span className={entry.dataKey === "income" ? "text-accent" : "text-negative"}>
            {formatCurrency(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function SpendingChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Tendencia mensual</CardTitle>
            <p className="mt-1 text-sm text-muted">Ingresos vs. gastos</p>
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
      <CardContent className="h-60 pl-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--negative))" stopOpacity={0.18} />
                <stop offset="100%" stopColor="hsl(var(--negative))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted))", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted))", fontSize: 11 }}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={38}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1.5 }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#incomeFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={200}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(var(--negative))"
              strokeWidth={2}
              fill="url(#expenseFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
