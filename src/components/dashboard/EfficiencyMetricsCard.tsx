import { cacData, ltvData, revenuePerEmployee } from "@/data/dashboardData";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingDown, Users } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber, formatCurrencyShort } from "./AnimatedNumber";

function MiniAreaChart({
  data,
  color,
  dataKey,
}: {
  data: { month: string; value: number }[];
  color: string;
  dataKey: string;
}) {
  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface-1))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "11px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(v: number) => [formatCurrencyShort(v), "CAC"]}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function EfficiencyMetricsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-5"
    >
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Growth & Efficiency
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* CAC */}
        <div className="rounded-xl p-4" style={{ background: "hsl(var(--surface-2))" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Customer Acquisition Cost
              </p>
              <AnimatedNumber
                value={cacData[cacData.length - 1].value}
                formatFn={formatCurrencyShort}
                className="metric-value text-2xl"
                style={{ color: "hsl(var(--signal-yellow))" }}
              />
            </div>
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: "hsl(var(--signal-green) / 0.1)",
                color: "hsl(var(--signal-green))",
              }}
            >
              <TrendingDown className="w-3 h-3" />
              -32% 6mo
            </span>
          </div>
          <MiniAreaChart data={cacData} color="hsl(42, 92%, 58%)" dataKey="cac" />
        </div>

        {/* LTV */}
        <div className="rounded-xl p-4" style={{ background: "hsl(var(--surface-2))" }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Customer Lifetime Value
          </p>
          <div className="flex items-end justify-between">
            <AnimatedNumber
              value={ltvData.current}
              formatFn={formatCurrencyShort}
              className="metric-value text-2xl"
              style={{ color: "hsl(var(--signal-blue))" }}
            />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">LTV : CAC Ratio</p>
              <AnimatedNumber
                value={ltvData.ratio}
                decimals={1}
                suffix="x"
                className="text-lg font-bold font-mono-custom"
                style={{ color: "hsl(var(--signal-green))" }}
              />
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--surface-3))" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "83%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              style={{
                background: "linear-gradient(90deg, hsl(210, 80%, 60%), hsl(152, 52%, 42%))",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Target ≥ 3x — Currently exceptional
          </p>
        </div>

        {/* Revenue per Employee */}
        <div className="rounded-xl p-4" style={{ background: "hsl(var(--surface-2))" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Revenue per Employee
              </p>
              <div className="flex items-baseline gap-1">
                <AnimatedNumber
                  value={revenuePerEmployee.current}
                  formatFn={formatCurrencyShort}
                  className="metric-value text-2xl"
                  style={{ color: "hsl(var(--signal-green))" }}
                />
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {revenuePerEmployee.headcount} FTE
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
