import { impactData } from "@/data/dashboardData";

const fmt = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`;

export default function ImpactBridgeCard() {
  const totalEconomicValue = impactData.reduce((a, b) => a + b.economicValue, 0);

  return (
    <div className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
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
        {impactData.map((item) => {
          const pct = (item.economicValue / totalEconomicValue) * 100;
          return (
            <div key={item.metric} className="rounded-xl p-3" style={{ background: "hsl(var(--surface-2))" }}>
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
                  <p
                    className="text-sm font-semibold font-mono-custom"
                    style={{ color: "hsl(var(--signal-blue))" }}
                  >
                    {fmt(item.economicValue)}
                  </p>
                </div>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--surface-3))" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, hsl(152, 52%, 42%), hsl(210, 80%, 60%))",
                  }}
                />
              </div>
            </div>
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
        <p
          className="metric-value text-xl"
          style={{ color: "hsl(var(--signal-green))" }}
        >
          {fmt(totalEconomicValue)}
        </p>
      </div>
    </div>
  );
}
