import { mrrData } from "@/data/dashboardData";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber, formatCurrencyShort } from "./AnimatedNumber";

export default function MRRCard() {
  const { current, growthPercent, history } = mrrData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--signal-blue))" }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Monthly Recurring Revenue
          </p>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{
            background: "hsl(var(--signal-green) / 0.1)",
            color: "hsl(var(--signal-green))",
          }}
        >
          <TrendingUp className="w-3 h-3" />
          +{growthPercent}% MoM
        </span>
      </div>

      <div>
        <AnimatedNumber
          value={current}
          formatFn={formatCurrencyShort}
          className="metric-value text-5xl"
          style={{ color: "hsl(var(--signal-blue))" } as React.CSSProperties}
        />
        <span className="text-muted-foreground text-sm ml-2">/mo</span>
      </div>

      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 80%, 60%)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(210, 80%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(v: number) => [formatCurrencyShort(v), "MRR"]}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(210, 80%, 60%)"
              strokeWidth={2}
              fill="url(#mrrGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
