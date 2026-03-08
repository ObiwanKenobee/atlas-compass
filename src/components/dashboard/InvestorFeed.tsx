import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvestorUpdates, useAddInvestorUpdate } from "@/hooks/useDashboardData";
import { Code2, Globe, Leaf, Link, Loader2, Plus, X, Send } from "lucide-react";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
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

const UPDATE_TYPES = ["product", "partnership", "data", "verification"] as const;

export default function InvestorFeed() {
  const { data: updates, isLoading } = useInvestorUpdates();
  const addUpdate = useAddInvestorUpdate();

  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateType, setUpdateType] = useState<string>("product");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    await addUpdate.mutateAsync({ title: title.trim(), description: description.trim(), update_type: updateType });
    setTitle("");
    setDescription("");
    setUpdateType("product");
    setComposing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Investor Transparency Feed
          </p>
          <p className="text-xs text-muted-foreground">Live operational progress</p>
        </div>
        <button
          onClick={() => setComposing((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: composing ? "hsl(var(--signal-green) / 0.12)" : "hsl(var(--surface-2))",
            color: composing ? "hsl(var(--signal-green))" : "hsl(var(--muted-foreground))",
            border: `1px solid ${composing ? "hsl(var(--signal-green) / 0.3)" : "hsl(var(--border))"}`,
          }}
        >
          {composing ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {composing ? "Cancel" : "Post Update"}
        </button>
      </div>

      {/* Compose form */}
      <AnimatePresence>
        {composing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl p-4 flex flex-col gap-3 border"
              style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))" }}
            >
              {/* Type selector */}
              <div className="flex gap-1.5 flex-wrap">
                {UPDATE_TYPES.map((t) => {
                  const cfg = typeConfig[t];
                  const active = updateType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUpdateType(t)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background: active ? `${cfg.color}20` : "hsl(var(--surface-3))",
                        color: active ? cfg.color : "hsl(var(--muted-foreground))",
                        border: `1px solid ${active ? `${cfg.color}40` : "hsl(var(--border))"}`,
                      }}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Title */}
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Update title…"
                maxLength={120}
                className="w-full text-sm font-medium bg-transparent outline-none border-b pb-2"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />

              {/* Description */}
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, what's next, and why it matters…"
                rows={3}
                maxLength={500}
                className="w-full text-xs bg-transparent outline-none resize-none leading-relaxed"
                style={{ color: "hsl(var(--foreground))" }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{description.length}/500</span>
                <button
                  type="submit"
                  disabled={addUpdate.isPending || !title.trim() || !description.trim()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                  style={{
                    background: "hsl(var(--signal-green))",
                    color: "hsl(var(--background))",
                  }}
                >
                  {addUpdate.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Publish
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Feed */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {(updates ?? []).map((item, i) => {
            const cfg = typeConfig[item.update_type] ?? typeConfig.product;
            const isLast = i === (updates?.length ?? 0) - 1;
            return (
              <div key={item.id} className="flex gap-3 relative">
                {!isLast && (
                  <div
                    className="absolute left-4 top-8 bottom-0 w-px"
                    style={{ background: "hsl(var(--border))" }}
                  />
                )}
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
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: `${cfg.color}15`, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.update_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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
      )}
    </motion.div>
  );
}
