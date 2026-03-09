import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useDashboardMetrics } from "@/hooks/useDashboardData";
import { RotateCcw, TrendingDown, TrendingUp, Loader2 } from "lucide-react";

const HIRE_COST = 12000;
const INFRA_UNIT = 1000;
const CONTRACT_VALUE = 5000;

export default function RunwaySimulator() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  const baseCash = metrics?.cash_on_hand ?? 5_400_000;
  const baseBurn = metrics?.burn_rate ?? 284_000;
  const baseMRR  = metrics?.mrr ?? 142_000;
  const baseRunway = metrics?.runway_months ?? 19;

  const [newRevenue, setNewRevenue] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [infraCost, setInfraCost] = useState(0);

  const revenueImpact = newRevenue * CONTRACT_VALUE;
  const hireCost = newHires * HIRE_COST;
  const infraDelta = infraCost * INFRA_UNIT;

  const adjustedBurn = Math.max(1, baseBurn + hireCost + infraDelta - revenueImpact);
  const adjustedMRR = baseMRR + revenueImpact;
  const simulatedRunway = Math.max(0, Math.round(baseCash / adjustedBurn));

  const runwayDelta = simulatedRunway - baseRunway;

  const signal =
    simulatedRunway >= 18
      ? { color: "hsl(var(--signal-green))", label: "Healthy", bg: "hsl(var(--signal-green) / 0.12)" }
      : simulatedRunway >= 12
      ? { color: "hsl(var(--signal-yellow))", label: "Caution", bg: "hsl(var(--signal-yellow) / 0.12)" }
      : { color: "hsl(var(--signal-red))", label: "Danger", bg: "hsl(var(--signal-red) / 0.12)" };

  const maxMonths = 36;
  const percent = Math.min((simulatedRunway / maxMonths) * 100, 100);
  const basePercent = Math.min((baseRunway / maxMonths) * 100, 100);

  const handleReset = () => {
    setNewRevenue(0);
    setNewHires(0);
    setInfraCost(0);
  };

  const isModified = newRevenue !== 0 || newHires !== 0 || infraCost !== 0;

  if (isLoading) {
    return (
      <div
        className="gradient-card border border-border rounded-2xl p-6 flex items-center justify-center h-64"
      >
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.06] blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: signal.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Runway Forecast Simulator
          </p>
          <p className="text-xs text-muted-foreground">
            Model scenarios against live data
          </p>
        </div>
        {isModified && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            style={{
              color: "hsl(var(--muted-foreground))",
              background: "hsl(var(--surface-2))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4">
        {/* Revenue */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">New Revenue Contracts</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-green))" }}>
              {newRevenue > 0 ? `+$${revenueImpact.toLocaleString()}/mo` : "—"}
            </p>
          </div>
          <Slider
            min={0} max={10} step={1}
            value={[newRevenue]}
            onValueChange={([v]) => setNewRevenue(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span className="font-medium">{newRevenue} contract{newRevenue !== 1 ? "s" : ""}</span>
            <span>10</span>
          </div>
        </div>

        {/* Hires */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">Team Expansion</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-yellow))" }}>
              {newHires > 0 ? `+$${hireCost.toLocaleString()}/mo` : "—"}
            </p>
          </div>
          <Slider
            min={0} max={20} step={1}
            value={[newHires]}
            onValueChange={([v]) => setNewHires(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span className="font-medium">{newHires} engineer{newHires !== 1 ? "s" : ""}</span>
            <span>20</span>
          </div>
        </div>

        {/* Infra */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">Infrastructure Costs</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-red))" }}>
              {infraCost > 0 ? `+$${infraDelta.toLocaleString()}/mo` : "—"}
            </p>
          </div>
          <Slider
            min={0} max={50} step={1}
            value={[infraCost]}
            onValueChange={([v]) => setInfraCost(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$0</span>
            <span className="font-medium">${infraCost}K</span>
            <span>$50K</span>
          </div>
        </div>
      </div>

      {/* Result card */}
      <div
        className="rounded-xl p-4 border transition-all duration-500"
        style={{
          background: "hsl(var(--surface-2))",
          borderColor: isModified ? `${signal.color}30` : "hsl(var(--border))",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">Simulated Runway</p>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: signal.bg, color: signal.color }}
          >
            {signal.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="metric-value text-4xl transition-all duration-300" style={{ color: signal.color }}>
            {simulatedRunway}
          </span>
          <span className="text-muted-foreground text-sm">months</span>
          {isModified && runwayDelta !== 0 && (
            <motion.span
              key={runwayDelta}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-0.5 text-xs font-semibold ml-1"
              style={{
                color: runwayDelta > 0 ? "hsl(var(--signal-green))" : "hsl(var(--signal-red))",
              }}
            >
              {runwayDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {runwayDelta > 0 ? "+" : ""}{runwayDelta} vs current
            </motion.span>
          )}
        </div>

        {/* Timeline bar */}
        <div
          className="relative h-2.5 rounded-full overflow-hidden mb-1.5 mt-3"
          style={{ background: "hsl(var(--surface-3))" }}
        >
          <div
            className="absolute h-full rounded-full opacity-25"
            style={{ width: `${basePercent}%`, background: "hsl(var(--muted-foreground))" }}
          />
          <div
            className="absolute h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${signal.color}88, ${signal.color})`,
              boxShadow: `0 0 10px ${signal.color}55`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Now</span><span>12mo</span><span>24mo</span><span>36mo</span>
        </div>

        {/* Burn + MRR breakdown */}
        {isModified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t overflow-hidden"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Adj. Burn/mo</p>
              <p className="text-sm font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-red))" }}>
                ${adjustedBurn.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Proj. MRR</p>
              <p className="text-sm font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-green))" }}>
                ${adjustedMRR.toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
