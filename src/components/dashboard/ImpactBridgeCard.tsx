import { impactData } from "@/data/dashboardData";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

const totalEconomicValue = impactData.reduce((a, b) => a + b.economicValue, 0);

export default function ImpactBridgeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 20%, hsl(152, 52%, 42%) 0%, transparent 60%)",
        }}
      />

      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Impact-to-Revenue Bridge
        </p>
        <p className="text-xs text-muted-foreground">
          Ecological outcomes → Economic value
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {impactData.map((item, i) => {
          const pct = (item.economicValue / totalEconomicValue) * 100;
          return (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl p-3"
              style={{ background: "hsl(var(--surface-2))" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium">{item.metric}</p>
                    <p
                      className="metric-value text-lg"
                      style={{ color: "hsl(var(--signal-green))" }}
                    >
                      {item.value}
                      <span className="text-muted-foreground text-xs font-normal ml-1">
                        {item.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Economic Value</p>
                  <AnimatedNumber
                    value={item.economicValue}
                    formatFn={(v) =>
                      v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`
                    }
                    className="text-sm font-semibold font-mono-custom"
                    style={{ color: "hsl(var(--signal-blue))" }}
                  />
                </div>
              </div>

              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "hsl(var(--surface-3))" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(152, 52%, 42%), hsl(210, 80%, 60%))",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ background: "hsl(var(--accent))" }}
      >
        <p className="text-xs font-medium text-muted-foreground">
          Total Marketplace Value
        </p>
        <AnimatedNumber
          value={totalEconomicValue}
          formatFn={(v) =>
            v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`
          }
          className="metric-value text-xl"
          style={{ color: "hsl(var(--signal-green))" }}
        />
      </div>
    </motion.div>
  );
}
