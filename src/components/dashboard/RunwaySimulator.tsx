import { useState } from "react";
import { runwayData } from "@/data/dashboardData";
import { Slider } from "@/components/ui/slider";

const BASE_CASH = runwayData.currentCash;
const BASE_BURN = runwayData.monthlyBurn;

export default function RunwaySimulator() {
  const [newRevenue, setNewRevenue] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [infraCost, setInfraCost] = useState(0);

  const adjustedBurn = BASE_BURN + newHires * 12000 + infraCost * 1000 - newRevenue * 5000;
  const simulatedRunway = Math.max(0, Math.round(BASE_CASH / adjustedBurn));

  const signal =
    simulatedRunway >= 18
      ? { color: "hsl(var(--signal-green))", label: "Healthy" }
      : simulatedRunway >= 12
      ? { color: "hsl(var(--signal-yellow))", label: "Caution" }
      : { color: "hsl(var(--signal-red))", label: "Danger" };

  const maxMonths = 36;
  const percent = Math.min((simulatedRunway / maxMonths) * 100, 100);
  const basePercent = Math.min((runwayData.runwayMonths / maxMonths) * 100, 100);

  return (
    <div className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: signal.color }}
      />

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Runway Forecast Simulator
        </p>
        <p className="text-xs text-muted-foreground">
          Adjust variables to model future scenarios
        </p>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">New Revenue Contracts</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-green))" }}>
              +${(newRevenue * 5000).toLocaleString()}/mo
            </p>
          </div>
          <Slider
            min={0}
            max={10}
            step={1}
            value={[newRevenue]}
            onValueChange={([v]) => setNewRevenue(v)}
            className="accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span><span>{newRevenue} contracts</span><span>10</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">Team Expansion</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-yellow))" }}>
              +${(newHires * 12000).toLocaleString()}/mo
            </p>
          </div>
          <Slider
            min={0}
            max={20}
            step={1}
            value={[newHires]}
            onValueChange={([v]) => setNewHires(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span><span>{newHires} engineers</span><span>20</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-medium">Infrastructure Costs</p>
            <p className="text-xs font-semibold font-mono-custom" style={{ color: "hsl(var(--signal-red))" }}>
              +${(infraCost * 1000).toLocaleString()}/mo
            </p>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={[infraCost]}
            onValueChange={([v]) => setInfraCost(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$0</span><span>${infraCost}K</span><span>$50K</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="rounded-xl p-4" style={{ background: "hsl(var(--surface-2))" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">Simulated Runway</p>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${signal.color}18`, color: signal.color }}
          >
            {signal.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="metric-value text-4xl" style={{ color: signal.color }}>
            {simulatedRunway}
          </span>
          <span className="text-muted-foreground text-sm">months</span>
          {simulatedRunway !== runwayData.runwayMonths && (
            <span
              className="text-xs font-semibold"
              style={{
                color:
                  simulatedRunway > runwayData.runwayMonths
                    ? "hsl(var(--signal-green))"
                    : "hsl(var(--signal-red))",
              }}
            >
              {simulatedRunway > runwayData.runwayMonths ? "+" : ""}
              {simulatedRunway - runwayData.runwayMonths} vs current
            </span>
          )}
        </div>

        {/* Comparison bar */}
        <div className="relative h-2.5 rounded-full overflow-hidden mb-1" style={{ background: "hsl(var(--surface-3))" }}>
          {/* Base */}
          <div
            className="absolute h-full rounded-full opacity-30"
            style={{ width: `${basePercent}%`, background: "hsl(var(--muted-foreground))" }}
          />
          {/* Simulated */}
          <div
            className="absolute h-full rounded-full transition-all duration-300"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${signal.color}88, ${signal.color})`,
              boxShadow: `0 0 8px ${signal.color}66`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Today</span>
          <span>12mo</span>
          <span>24mo</span>
          <span>36mo</span>
        </div>
      </div>
    </div>
  );
}
