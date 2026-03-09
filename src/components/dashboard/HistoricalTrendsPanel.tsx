import { useState } from "react";
import { motion } from "framer-motion";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useMetricsHistory } from "@/hooks/useDashboardData";
import { Loader2, TrendingDown, TrendingUp, BarChart2, Database } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const tabs = [
  { key: "burn_rate",    label: "Burn Rate", color: "hsl(152, 62%, 46%)", fmt: (v: number) => `$${(v / 1000).toFixed(0)}K` },
  { key: "mrr",         label: "MRR",       color: "hsl(210, 80%, 60%)", fmt: (v: number) => `$${(v / 1000).toFixed(0)}K` },
  { key: "cac",         label: "CAC",       color: "hsl(42, 92%, 58%)",  fmt: (v: number) => `$${(v / 1000).toFixed(1)}K` },
  { key: "cash_on_hand",label: "Cash",      color: "hsl(280, 65%, 65%)", fmt: (v: number) => `$${(v / 1000000).toFixed(2)}M` },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const PRESETS = [
  { label: "3M",  months: 3 },
  { label: "6M",  months: 6 },
  { label: "12M", months: 12 },
  { label: "All", months: 36 },
] as const;

function DateRangePicker({
  from, to, onFromChange, onToChange,
}: {
  from: Date; to: Date;
  onFromChange: (d: Date) => void;
  onToChange: (d: Date) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            <CalendarIcon className="w-3 h-3" />
            {format(from, "MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start"
          style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}>
          <Calendar
            mode="single"
            selected={from}
            onSelect={(d) => d && onFromChange(startOfMonth(d))}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>→</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            <CalendarIcon className="w-3 h-3" />
            {format(to, "MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start"
          style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}>
          <Calendar
            mode="single"
            selected={to}
            onSelect={(d) => d && onToChange(d)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function HistoricalTrendsPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>("burn_rate");
  const [from, setFrom] = useState<Date>(subMonths(new Date(), 11));
  const [to, setTo] = useState<Date>(new Date());
  const [activePreset, setActivePreset] = useState<number | null>(12);

  const { data: history, isLoading } = useMetricsHistory(from, to);
  const tab = tabs.find((t) => t.key === activeTab)!;

  const handlePreset = (months: number) => {
    setActivePreset(months);
    setFrom(subMonths(new Date(), months - 1));
    setTo(new Date());
  };

  const chartData = (history ?? []).map((row) => ({
    month: format(new Date(row.metric_date), "MMM ''yy"),
    value: Number(row[activeTab]),
    date: row.metric_date,
  }));

  const values = chartData.map((d) => d.value);
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const peak = Math.max(...(values.length ? values : [0]));
  const trough = Math.min(...(values.length ? values : [0]));
  const change = first ? ((last - first) / first) * 100 : 0;
  const isPositive = change > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        <span className="text-xs font-medium uppercase tracking-widest px-3 text-muted-foreground">
          Historical Trends
        </span>
        <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              Performance History
            </p>
            <div className="flex items-center gap-3">
              <span className="metric-value text-2xl" style={{ color: tab.color }}>
                {values.length ? tab.fmt(last) : "—"}
              </span>
              {values.length > 1 && (
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: isPositive
                      ? "hsl(var(--signal-green) / 0.1)"
                      : "hsl(var(--signal-red) / 0.1)",
                    color: isPositive ? "hsl(var(--signal-green))" : "hsl(var(--signal-red))",
                  }}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Preset buttons */}
            <div
              className="flex rounded-lg p-0.5 gap-0.5"
              style={{ background: "hsl(var(--surface-2))" }}
            >
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.months)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150"
                  style={{
                    background: activePreset === p.months ? "hsl(var(--surface-3))" : "transparent",
                    color: activePreset === p.months
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Metric tabs */}
            <div
              className="flex rounded-lg p-0.5 gap-0.5"
              style={{ background: "hsl(var(--surface-2))" }}
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
                  style={{
                    background: activeTab === t.key ? "hsl(var(--surface-3))" : "transparent",
                    color: activeTab === t.key ? t.color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <DateRangePicker
              from={from}
              to={to}
              onFromChange={(d) => { setFrom(d); setActivePreset(null); }}
              onToChange={(d) => { setTo(d); setActivePreset(null); }}
            />
          </div>
        </div>

        {/* Chart */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(var(--surface-2))" }}
            >
              <Database className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-0.5">No historical data</p>
              <p className="text-xs text-muted-foreground">
                Data will appear here once metrics are recorded over time
              </p>
            </div>
          </div>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`trendGrad-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tab.color} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={tab.fmt}
                  width={54}
                />
                <ReferenceLine
                  y={avg}
                  stroke={tab.color}
                  strokeDasharray="4 4"
                  strokeOpacity={0.35}
                  label={{
                    value: `avg ${tab.fmt(avg)}`,
                    position: "insideTopRight",
                    fontSize: 9,
                    fill: tab.color,
                    opacity: 0.6,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface-1))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "hsl(var(--foreground))",
                    boxShadow: "0 8px 24px hsl(0 0% 0% / 0.3)",
                  }}
                  formatter={(v: number) => [tab.fmt(v), tab.label]}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 2 }}
                  cursor={{ stroke: tab.color, strokeOpacity: 0.3, strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={tab.color}
                  strokeWidth={2.5}
                  fill={`url(#trendGrad-${activeTab})`}
                  dot={false}
                  activeDot={{ r: 5, fill: tab.color, strokeWidth: 2, stroke: "hsl(var(--surface-1))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats row */}
        {!isLoading && chartData.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {[
              { label: "Period Start", val: tab.fmt(first), icon: null },
              { label: "Period End",   val: tab.fmt(last),  icon: null },
              { label: "Peak",         val: tab.fmt(peak),  icon: null },
              { label: "Average",      val: tab.fmt(avg),   icon: <BarChart2 className="w-3 h-3" /> },
            ].map(({ label, val, icon }) => (
              <div
                key={label}
                className="rounded-xl px-3 py-2.5"
                style={{ background: "hsl(var(--surface-2))" }}
              >
                <div className="flex items-center gap-1 mb-1">
                  {icon && <span style={{ color: tab.color }}>{icon}</span>}
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className="text-sm font-semibold font-mono-custom" style={{ color: tab.color }}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
