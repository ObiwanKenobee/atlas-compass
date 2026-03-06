import { burnRateData } from "@/data/dashboardData";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber, formatCurrencyShort } from "./AnimatedNumber";
import InlineEdit from "./InlineEdit";
import { useDashboardMetrics, useUpdateMetrics } from "@/hooks/useDashboardData";

export default function BurnRateCard() {
  const { data: live } = useDashboardMetrics();
  const { mutateAsync: updateMetric } = useUpdateMetrics();

  const burnRate = live ? Number(live.burn_rate) : burnRateData.current;
  const prevMonth = burnRateData.previousMonth;
  const { trend, history } = burnRateData;
  const delta = ((prevMonth - burnRate) / prevMonth) * 100;
  const isDown = trend === "down";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: isDown ? "hsl(var(--signal-green))" : "hsl(var(--signal-red))" }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Monthly Burn Rate
          </p>
          <p className="text-xs text-muted-foreground">Expenses – Revenue</p>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            backgroundColor: isDown ? "hsl(var(--signal-green) / 0.1)" : "hsl(var(--signal-red) / 0.1)",
            color: isDown ? "hsl(var(--signal-green))" : "hsl(var(--signal-red))",
          }}
        >
          {isDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {delta.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <InlineEdit
          label="Burn Rate"
          value={burnRate}
          formatFn={formatCurrencyShort}
          onSave={(v) => updateMetric({ burn_rate: v })}
          valueColor={isDown ? "hsl(var(--signal-green))" : "hsl(var(--signal-red))"}
          className="metric-value text-5xl"
        />
        <span className="text-muted-foreground text-sm">/mo</span>
      </div>

      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDown ? "hsl(152, 62%, 46%)" : "hsl(0, 72%, 55%)"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isDown ? "hsl(152, 62%, 46%)" : "hsl(0, 72%, 55%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface-1))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--foreground))" }}
              formatter={(v: number) => [formatCurrencyShort(v), "Burn"]}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area type="monotone" dataKey="value" stroke={isDown ? "hsl(152, 62%, 46%)" : "hsl(0, 72%, 55%)"} strokeWidth={2} fill="url(#burnGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        {history.map((h) => <span key={h.month}>{h.month}</span>)}
      </div>
    </motion.div>
  );
}
