import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/lib/currency";
import { getCategoryIconByKey } from "@/lib/category-icons";
import type { CategoryBreakdownItem } from "../utils";

const palette = [
  "hsl(var(--accent))",
  "hsl(var(--negative))",
  "hsl(96 20% 65%)",
  "hsl(4 40% 68%)",
  "hsl(228 6% 58%)",
  "hsl(96 20% 45%)",
];

function BreakdownTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CategoryBreakdownItem }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-kubo-sm border border-border bg-surface px-3 py-2 text-xs shadow-kubo-lg">
      <p className="font-medium">{item.name}</p>
      <p className="font-mono tabular">{formatCurrency(item.amount)}</p>
    </div>
  );
}

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gasto por categoría</CardTitle>
        <p className="mt-1 text-sm font-medium">Mes en curso</p>
      </CardHeader>
      <CardContent className="pl-0 pt-4">
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            Todavía no registras gastos este mes.
          </p>
        ) : (
          <div style={{ height: Math.max(data.length * 44, 160) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted))", fontSize: 12 }}
                  tickFormatter={(v) => formatCompactNumber(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={110}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <Tooltip content={<BreakdownTooltip />} cursor={{ fill: "hsl(var(--surface-hover))" }} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={22}>
                  {data.map((entry, i) => (
                    <Cell key={entry.name} fill={palette[i % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
      {data.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border p-5">
          {data.slice(0, 5).map((item) => {
            const Icon = getCategoryIconByKey(item.icon);
            return (
              <div key={item.name} className="flex items-center gap-2.5 text-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-kubo-sm bg-surface-hover text-muted">
                  <Icon className="size-3.5" />
                </div>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="font-mono tabular text-muted">{formatCurrency(item.amount)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
