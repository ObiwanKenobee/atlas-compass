import { useState, useRef, useEffect } from "react";
import { Check, Pencil, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InlineEditProps {
  label: string;
  value: number;
  formatFn: (v: number) => string;
  onSave: (v: number) => Promise<void>;
  inputPrefix?: string;
  inputSuffix?: string;
  className?: string;
  valueColor?: string;
}

export default function InlineEdit({
  label,
  value,
  formatFn,
  onSave,
  inputPrefix = "$",
  inputSuffix = "",
  className = "",
  valueColor,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(String(value));
      setTimeout(() => inputRef.current?.select(), 30);
    }
  }, [editing, value]);

  const handleSave = async () => {
    const num = parseFloat(draft.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(num);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="group relative">
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-2"
          >
            <span className="text-muted-foreground text-sm">{inputPrefix}</span>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              className={`${className} bg-transparent border-b-2 outline-none w-full font-mono-custom`}
              style={{
                borderColor: valueColor ?? "hsl(var(--primary))",
                color: valueColor ?? "hsl(var(--foreground))",
                caretColor: valueColor ?? "hsl(var(--primary))",
              }}
              disabled={saving}
            />
            {inputSuffix && <span className="text-muted-foreground text-sm">{inputSuffix}</span>}
            <div className="flex items-center gap-1 flex-shrink-0">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--primary))" }} />
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                    style={{ background: "hsl(var(--signal-green) / 0.15)", color: "hsl(var(--signal-green))" }}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                    style={{ background: "hsl(var(--surface-3))", color: "hsl(var(--muted-foreground))" }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setEditing(true)}
          >
            <span className={className} style={{ color: valueColor }}>
              {saved ? (
                <span style={{ color: "hsl(var(--signal-green))" }}>✓ Saved</span>
              ) : (
                formatFn(value)
              )}
            </span>
            <Pencil
              className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
