import dashboardBg from "@/assets/dashboard-bg.jpg";
import BurnRateCard from "@/components/dashboard/BurnRateCard";
import RunwayCard from "@/components/dashboard/RunwayCard";
import MRRCard from "@/components/dashboard/MRRCard";
import RevenueStreamsCard from "@/components/dashboard/RevenueStreamsCard";
import CostStructureCard from "@/components/dashboard/CostStructureCard";
import EfficiencyMetricsCard from "@/components/dashboard/EfficiencyMetricsCard";
import ImpactBridgeCard from "@/components/dashboard/ImpactBridgeCard";
import RunwaySimulator from "@/components/dashboard/RunwaySimulator";
import InvestorFeed from "@/components/dashboard/InvestorFeed";

const now = new Date();
const dateStr = now.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Index() {
  return (
    <div
      className="min-h-screen scrollbar-thin"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Header */}
      <header
        className="relative border-b border-border overflow-hidden"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <img
          src={dashboardBg}
          alt="Atlas Sanctum dashboard background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 px-6 py-8 md:px-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "hsl(var(--signal-green))" }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "hsl(var(--signal-green))" }}
                >
                  Live Dashboard
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Atlas Sanctum
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                North-Star Financial Intelligence Panel
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{dateStr}</p>
              <p
                className="text-xs font-mono-custom mt-1"
                style={{ color: "hsl(var(--signal-green))" }}
              >
                Series A · Q1 2025
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8 lg:px-10 space-y-10 max-w-[1600px] mx-auto">

        {/* ── Section 1: North-Star Panel ─────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="h-px flex-1"
              style={{ background: "hsl(var(--border))" }}
            />
            <span
              className="text-xs font-medium uppercase tracking-widest px-3"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Survival Metrics
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "hsl(var(--border))" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BurnRateCard />
            <RunwayCard />
            <MRRCard />
          </div>
        </section>

        {/* ── Section 2: Financial Health Snapshot ────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
            <span className="text-xs font-medium uppercase tracking-widest px-3 text-muted-foreground">
              Financial Health Snapshot
            </span>
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RevenueStreamsCard />
            <CostStructureCard />
          </div>
        </section>

        {/* ── Section 3: Efficiency + Impact ──────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
            <span className="text-xs font-medium uppercase tracking-widest px-3 text-muted-foreground">
              Growth, Efficiency & Impact
            </span>
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EfficiencyMetricsCard />
            <ImpactBridgeCard />
          </div>
        </section>

        {/* ── Section 4: Simulator + Feed ─────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
            <span className="text-xs font-medium uppercase tracking-widest px-3 text-muted-foreground">
              Scenario Planning & Transparency
            </span>
            <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RunwaySimulator />
            <InvestorFeed />
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-6">
          <span>Atlas Sanctum — Confidential · Not for distribution</span>
          <span className="font-mono-custom">v1.0.0 · Q1 2025</span>
        </footer>
      </main>
    </div>
  );
}
