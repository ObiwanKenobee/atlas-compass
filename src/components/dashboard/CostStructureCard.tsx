import { costStructureData } from "@/data/dashboardData";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const fmt = (v: number) => `$${(v / 1000).toFixed(0)}K`;
const total = costStructureData.reduce((a, b) => a + b.value, 0);

export default function CostStructureCard() {
  return (
    <div className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Cost Structure
        </p>
        <p className="text-xs text-muted-foreground">
          Total: {fmt(total)}/mo
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-36 w-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--surface-1))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(v: number, name: string) => [fmt(v), name]}
              />
              <Pie
                data={costStructureData}
                cx="50%"
                cy="50%"
                innerRadius={34}
                outerRadius={58}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {costStructureData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {costStructureData.map((c) => (
            <div key={c.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: c.color }}
                />
                <p className="text-xs text-muted-foreground truncate">{c.name}</p>
              </div>
              <p className="text-xs font-semibold font-mono-custom flex-shrink-0" style={{ color: c.color }}>
                {((c.value / total) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
