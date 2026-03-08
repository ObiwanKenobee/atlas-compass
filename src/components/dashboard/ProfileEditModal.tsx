import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, User } from "lucide-react";
import { useInvestorProfile, useUpdateProfile } from "@/hooks/useDashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ open, onClose }: Props) {
  const { data: profile } = useInvestorProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setFirmName(profile.firm_name ?? "");
      setNotes(profile.notes ?? "");
    }
  }, [profile, open]);

  const handleSave = async () => {
    await updateProfile({ full_name: fullName, firm_name: firmName, notes });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const inputStyle = {
    background: "hsl(var(--surface-2))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: "hsl(var(--background) / 0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl"
            style={{
              background: "hsl(var(--surface-1))",
              borderColor: "hsl(var(--border))",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--primary) / 0.12)" }}
                >
                  <User className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-sm">Edit Profile</h2>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Update your investor details
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "hsl(var(--muted-foreground))" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Firm Name
                </label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Sequoia Capital"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Notes
                  <span className="ml-1 font-normal" style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Investment thesis, communication preferences…"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors resize-none"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Access tier read-only badge */}
            {profile?.access_tier && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs"
                style={{ background: "hsl(var(--surface-2))", color: "hsl(var(--muted-foreground))" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: profile.access_tier === "full"
                      ? "hsl(var(--signal-green))"
                      : "hsl(var(--muted-foreground))",
                  }}
                />
                <span>Access tier: </span>
                <span
                  className="font-medium capitalize"
                  style={{
                    color: profile.access_tier === "full"
                      ? "hsl(var(--signal-green))"
                      : "hsl(var(--foreground))",
                  }}
                >
                  {profile.access_tier}
                </span>
                <span className="ml-auto" style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}>
                  Managed by admin
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{ color: "hsl(var(--muted-foreground))" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending || saved}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-opacity"
                style={{
                  background: saved ? "hsl(var(--signal-green) / 0.2)" : "hsl(var(--primary))",
                  color: saved ? "hsl(var(--signal-green))" : "hsl(var(--primary-foreground))",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : null}
                {isPending ? "Saving…" : saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
