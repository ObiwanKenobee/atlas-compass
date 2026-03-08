import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronDown, ChevronUp, Loader2, Check, Shield } from "lucide-react";
import { useDashboardMetrics, useUpdateMetrics } from "@/hooks/useDashboardData";

interface FieldDef {
  key: string;
  label: string;
  prefix: string;
  suffix: string;
  description: string;
}

const FIELDS: FieldDef[] = [
  { key: "burn_rate",            label: "Monthly Burn Rate",      prefix: "$", suffix: "/mo",  description: "Total monthly expenses minus revenue" },
  { key: "mrr",                  label: "MRR",                    prefix: "$", suffix: "/mo",  description: "Monthly Recurring Revenue" },
  { key: "mrr_growth_percent",   label: "MRR Growth",             prefix: "",  suffix: "%",   description: "Month-over-month growth rate" },
  { key: "cash_on_hand",         label: "Cash on Hand",           prefix: "$", suffix: "",    description: "Current bank balance across all accounts" },
  { key: "runway_months",        label: "Runway",                 prefix: "",  suffix: " mo", description: "Months of runway at current burn" },
  { key: "cac",                  label: "CAC",                    prefix: "$", suffix: "",    description: "Customer Acquisition Cost" },
  { key: "ltv",                  label: "LTV",                    prefix: "$", suffix: "",    description: "Customer Lifetime Value" },
  { key: "headcount",            label: "Headcount",              prefix: "",  suffix: " FTE",description: "Full-time employee count" },
  { key: "revenue_per_employee", label: "Revenue / Employee",     prefix: "$", suffix: "/mo", description: "MRR divided by headcount" },
];

export default function MetricEditPanel() {
  const { data: live } = useDashboardMetrics();
  const { mutateAsync: updateMetric, isPending } = useUpdateMetrics();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Sync draft when live data arrives
  useEffect(() => {
    if (live) {
      const initial: Record<string, string> = {};
      FIELDS.forEach(f => {
        const v = (live as Record<string, unknown>)[f.key];
        initial[f.key] = v !== undefined && v !== null ? String(v) : "";
      });
      setDraft(initial);
    }
  }, [live]);

  const handleSave = async () => {
    const updates: Record<string, number> = {};
    FIELDS.forEach(f => {
      const num = parseFloat(draft[f.key]?.replace(/[^0-9.-]/g, "") ?? "");
      if (!isNaN(num)) updates[f.key] = num;
    });
    await updateMetric(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface-1))" }}
    >
      {/* Header / toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors"
        style={{ background: open ? "hsl(var(--surface-2))" : "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--surface-2))")}
        onMouseLeave={e => (e.currentTarget.style.background = open ? "hsl(var(--surface-2))" : "transparent")}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(var(--primary) / 0.12)" }}
          >
            <Shield className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Founder Edit Panel</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Update all financial metrics — saves to database in real time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
              style={{ background: "hsl(var(--signal-green) / 0.12)", color: "hsl(var(--signal-green))" }}
            >
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
          )}
        </div>
      </button>

      {/* Expanded form */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-6 pt-2">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              >
                {FIELDS.map(field => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {field.label}
                    </label>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground) / 0.6)", minHeight: "1rem" }}>
                      {field.description}
                    </p>
                    <div
                      className="flex items-center rounded-lg border overflow-hidden"
                      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface-2))" }}
                    >
                      {field.prefix && (
                        <span
                          className="px-3 py-2 text-sm border-r font-mono-custom"
                          style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))", background: "hsl(var(--surface-3))" }}
                        >
                          {field.prefix}
                        </span>
                      )}
                      <input
                        type="text"
                        value={draft[field.key] ?? ""}
                        onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                        className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-mono-custom"
                        style={{ color: "hsl(var(--foreground))" }}
                        placeholder="—"
                      />
                      {field.suffix && (
                        <span
                          className="px-3 py-2 text-sm border-l font-mono-custom"
                          style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))", background: "hsl(var(--surface-3))" }}
                        >
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Changes update all cards immediately after saving.
                </p>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isPending ? "Saving…" : saved ? "Saved!" : "Save All Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
