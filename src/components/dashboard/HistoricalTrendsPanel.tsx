import { useState } from "react";
import { motion } from "framer-motion";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useMetricsHistory } from "@/hooks/useDashboardData";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const tabs = [
  { key: "burn_rate", label: "Burn Rate", color: "hsl(152, 62%, 46%)", fmt: (v: number) => `$${(v / 1000).toFixed(0)}K` },
  { key: "mrr", label: "MRR", color: "hsl(210, 80%, 60%)", fmt: (v: number) => `$${(v / 1000).toFixed(0)}K` },
  { key: "cac", label: "CAC", color: "hsl(42, 92%, 58%)", fmt: (v: number) => `$${(v / 1000).toFixed(1)}K` },
] as const;

type TabKey = (typeof tabs)[number]["key"];

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
            className={cn("h-7 gap-1.5 text-xs font-normal border-border bg-surface-2")}
            style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))" }}
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

      <span className="text-xs text-muted-foreground">→</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))" }}
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

  const { data: history, isLoading } = useMetricsHistory(from, to);
  const tab = tabs.find((t) => t.key === activeTab)!;

  const chartData = (history ?? []).map((row) => ({
    month: format(new Date(row.metric_date), "MMM ''yy"),
    value: Number(row[activeTab]),
  }));

  const values = chartData.map((d) => d.value);
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              12-Month Performance
            </p>
            <div className="flex items-center gap-3">
              <span className="metric-value text-2xl" style={{ color: tab.color }}>
                {tab.fmt(last)}
              </span>
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
                {Math.abs(change).toFixed(1)}% range
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              onFromChange={setFrom}
              onToChange={setTo}
            />
          </div>
        </div>

        {/* Chart */}
        {isLoading ? (
          <div className="h-56 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data for selected range</p>
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={tab.color} stopOpacity={0.3} />
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
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface-1))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(v: number) => [tab.fmt(v), tab.label]}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={tab.color}
                  strokeWidth={2.5}
                  fill="url(#trendGrad)"
                  dot={{ r: 3, fill: tab.color, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: tab.color }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Mini stats row */}
        {!isLoading && chartData.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            {[
              { label: "Period Start", val: tab.fmt(first) },
              { label: "Period End", val: tab.fmt(last) },
              { label: "Peak", val: tab.fmt(Math.max(...values)) },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
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
