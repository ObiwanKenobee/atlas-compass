import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import dashboardBg from "@/assets/dashboard-bg.jpg";
import NavBar from "@/components/dashboard/NavBar";
import BurnRateCard from "@/components/dashboard/BurnRateCard";
import RunwayCard from "@/components/dashboard/RunwayCard";
import MRRCard from "@/components/dashboard/MRRCard";
import RevenueStreamsCard from "@/components/dashboard/RevenueStreamsCard";
import CostStructureCard from "@/components/dashboard/CostStructureCard";
import EfficiencyMetricsCard from "@/components/dashboard/EfficiencyMetricsCard";
import ImpactBridgeCard from "@/components/dashboard/ImpactBridgeCard";
import RunwaySimulator from "@/components/dashboard/RunwaySimulator";
import InvestorFeed from "@/components/dashboard/InvestorFeed";
import ExportButton from "@/components/dashboard/ExportButton";
import HistoricalTrendsPanel from "@/components/dashboard/HistoricalTrendsPanel";
import AuthPage from "./AuthPage";

const now = new Date();
const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const sectionInitial = { opacity: 0, y: 28 };
const sectionAnimate = { opacity: 1, y: 0 };
const sectionTransition = { duration: 0.5 };

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
      <span className="text-xs font-medium uppercase tracking-widest px-3 text-muted-foreground">{label}</span>
      <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
    </div>
  );
}

export default function Index() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "hsl(var(--primary))" }} />
    </div>
  );

  if (!session) return <AuthPage />;

  return (
    <div className="min-h-screen scrollbar-thin" style={{ background: "hsl(var(--background))" }}>
      <NavBar />

      <header className="relative border-b border-border overflow-hidden">
        <img src={dashboardBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative z-10 px-6 py-7 md:px-10">
          <div className="flex items-start justify-between flex-wrap gap-4 max-w-[1600px] mx-auto">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--signal-green))" }} />
                <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "hsl(var(--signal-green))" }}>Live Financial Dashboard</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">North-Star Panel</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Series A · Q1 2025 · Confidential</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">{dateStr}</p>
              </div>
              <ExportButton targetId="dashboard-export-root" />
            </motion.div>
          </div>
        </div>
      </header>

      <main id="dashboard-export-root" className="px-4 py-8 md:px-8 lg:px-10 space-y-10 max-w-[1600px] mx-auto">
        <motion.section initial={sectionInitial} animate={sectionAnimate} transition={{ ...sectionTransition, delay: 0.1 }}>
          <SectionDivider label="Survival Metrics" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BurnRateCard />
            <RunwayCard />
            <MRRCard />
          </div>
        </motion.section>

        <motion.section initial={sectionInitial} whileInView={sectionAnimate} viewport={{ once: true, margin: "-80px" }} transition={sectionTransition}>
          <SectionDivider label="Financial Health Snapshot" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RevenueStreamsCard />
            <CostStructureCard />
          </div>
        </motion.section>

        <HistoricalTrendsPanel />

        <motion.section initial={sectionInitial} whileInView={sectionAnimate} viewport={{ once: true, margin: "-80px" }} transition={sectionTransition}>
          <SectionDivider label="Growth, Efficiency & Impact" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EfficiencyMetricsCard />
            <ImpactBridgeCard />
          </div>
        </motion.section>

        <motion.section initial={sectionInitial} whileInView={sectionAnimate} viewport={{ once: true, margin: "-80px" }} transition={sectionTransition}>
          <SectionDivider label="Scenario Planning & Transparency" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RunwaySimulator />
            <InvestorFeed />
          </div>
        </motion.section>

        <footer className="pb-8 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-6">
          <span>Atlas Sanctum · Confidential · Not for distribution</span>
          <span className="font-mono-custom">v1.0.0 · Q1 2025</span>
        </footer>
      </main>
    </div>
  );
}
