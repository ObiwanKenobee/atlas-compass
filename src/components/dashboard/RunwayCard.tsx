import { runwayData } from "@/data/dashboardData";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import InlineEdit from "./InlineEdit";
import { useDashboardMetrics, useUpdateMetrics } from "@/hooks/useDashboardData";

const milestones = [0, 6, 12, 18, 24];

export default function RunwayCard() {
  const { data: live } = useDashboardMetrics();
  const { mutateAsync: updateMetric } = useUpdateMetrics();

  const runwayMonths = live ? Number(live.runway_months) : runwayData.runwayMonths;
  const currentCash = live ? Number(live.cash_on_hand) : runwayData.currentCash;
  const monthlyBurn = live ? Number(live.burn_rate) : runwayData.monthlyBurn;

  const maxMonths = 24;
  const percent = Math.min((runwayMonths / maxMonths) * 100, 100);

  const signal =
    runwayMonths >= 18
      ? { color: "hsl(var(--signal-green))", label: "Healthy", cls: "text-signal-green" }
      : runwayMonths >= 12
      ? { color: "hsl(var(--signal-yellow))", label: "Caution", cls: "text-signal-yellow" }
      : { color: "hsl(var(--signal-red))", label: "Danger", cls: "text-signal-red" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: signal.color }} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">Runway</p>
          <p className="text-xs text-muted-foreground">Cash / Monthly Burn</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${signal.color}18`, color: signal.color }}>
          {signal.label}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <InlineEdit
          label="Runway"
          value={runwayMonths}
          formatFn={(v) => String(Math.round(v))}
          onSave={(v) => updateMetric({ runway_months: Math.round(v) })}
          valueColor={signal.color}
          className={`metric-value text-5xl ${signal.cls}`}
          inputPrefix=""
          inputSuffix="mo"
        />
        <span className="text-muted-foreground text-sm">months</span>
      </div>

      <div className="mt-2">
        <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: "hsl(var(--surface-3))" }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            style={{ background: `linear-gradient(90deg, ${signal.color}88, ${signal.color})`, boxShadow: `0 0 12px ${signal.color}66` }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
            initial={{ left: "0%" }}
            animate={{ left: `calc(${percent}% - 6px)` }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            style={{ background: signal.color, borderColor: "hsl(var(--card))", boxShadow: `0 0 8px ${signal.color}` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {milestones.map((m) => (
            <div key={m} className="flex flex-col items-center gap-0.5">
              <div className="w-px h-1.5" style={{ background: "hsl(var(--border))" }} />
              <span className="text-xs text-muted-foreground">{m === 0 ? "Today" : `${m}mo`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-1 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Cash on Hand</p>
          <div className="flex items-center gap-1">
            <InlineEdit
              label="Cash on Hand"
              value={currentCash}
              formatFn={(v) => `$${(v / 1_000_000).toFixed(2)}M`}
              onSave={(v) => updateMetric({ cash_on_hand: v })}
              className="text-sm font-semibold font-mono-custom"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Monthly Burn</p>
          <p className="text-sm font-semibold font-mono-custom">
            ${monthlyBurn.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
