import { revenueStreamsData, revenueStreamsMonthly } from "@/data/dashboardData";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;

export default function RevenueStreamsCard() {
  return (
    <div className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Revenue Streams
        </p>
        <p className="text-xs text-muted-foreground">6-month stacked contribution</p>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueStreamsMonthly} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--surface-1))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(v: number, name: string) => [fmt(v), name]}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Bar dataKey="api" stackId="a" fill="#3fd68f" name="Verification APIs" radius={[0,0,0,0]} />
            <Bar dataKey="enterprise" stackId="a" fill="#4bb8a6" name="Enterprise Sims" />
            <Bar dataKey="marketplace" stackId="a" fill="#5a9fd4" name="Marketplace" />
            <Bar dataKey="gov" stackId="a" fill="#8b7cf8" name="Gov / Inst." radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {revenueStreamsData.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{s.name}</p>
              <p className="text-xs font-semibold font-mono-custom" style={{ color: s.color }}>
                {fmt(s.value)}/mo
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
