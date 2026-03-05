import { investorFeedData } from "@/data/dashboardData";
import { Code2, Globe, Leaf, Link, Zap } from "lucide-react";

const typeConfig: Record<string, { icon: JSX.Element; color: string; label: string }> = {
  product: {
    icon: <Code2 className="w-3.5 h-3.5" />,
    color: "hsl(var(--signal-blue))",
    label: "Product",
  },
  partnership: {
    icon: <Link className="w-3.5 h-3.5" />,
    color: "hsl(var(--signal-yellow))",
    label: "Partnership",
  },
  data: {
    icon: <Globe className="w-3.5 h-3.5" />,
    color: "hsl(210, 60%, 65%)",
    label: "Data",
  },
  verification: {
    icon: <Leaf className="w-3.5 h-3.5" />,
    color: "hsl(var(--signal-green))",
    label: "Verified",
  },
};

export default function InvestorFeed() {
  return (
    <div className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          Investor Transparency Feed
        </p>
        <p className="text-xs text-muted-foreground">Live operational progress</p>
      </div>

      <div className="flex flex-col gap-0">
        {investorFeedData.map((item, i) => {
          const cfg = typeConfig[item.type] || typeConfig.product;
          const isLast = i === investorFeedData.length - 1;
          return (
            <div key={i} className="flex gap-3 relative">
              {/* Timeline line */}
              {!isLast && (
                <div
                  className="absolute left-4 top-8 bottom-0 w-px"
                  style={{ background: "hsl(var(--border))" }}
                />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5"
                style={{
                  background: `${cfg.color}18`,
                  color: cfg.color,
                  border: `1px solid ${cfg.color}30`,
                }}
              >
                {cfg.icon}
              </div>

              <div className={`flex-1 pb-4 ${isLast ? "" : ""}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: `${cfg.color}15`, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-sm font-medium mb-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
