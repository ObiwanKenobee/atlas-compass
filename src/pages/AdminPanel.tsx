import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, Loader2, Check, Users, Edit2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInvestorProfile } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import atlasLogo from "@/assets/atlas-logo.png";

type InvestorProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  firm_name: string | null;
  access_tier: string;
  notes: string | null;
  updated_at: string;
};

function useAllProfiles() {
  return useQuery({
    queryKey: ["all_investor_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investor_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as InvestorProfile[];
    },
  });
}

function useUpdateAnyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { access_tier?: string; notes?: string };
    }) => {
      const { error } = await supabase
        .from("investor_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all_investor_profiles"] }),
  });
}

function ProfileRow({ profile }: { profile: InvestorProfile }) {
  const { mutateAsync: updateProfile, isPending } = useUpdateAnyProfile();
  const [tier, setTier] = useState(profile.access_tier);
  const [notes, setNotes] = useState(profile.notes ?? "");
  const [editingNotes, setEditingNotes] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTierChange = async (newTier: string) => {
    setTier(newTier);
    await updateProfile({ id: profile.id, updates: { access_tier: newTier } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleNotesSave = async () => {
    await updateProfile({ id: profile.id, updates: { notes } });
    setEditingNotes(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const initials = profile.full_name
    ? profile.full_name.trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : (profile.user_id.slice(0, 2).toUpperCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{
        background: "hsl(var(--surface-1))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(152, 60%, 34%))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {profile.full_name ?? <span style={{ color: "hsl(var(--muted-foreground))" }}>Unnamed Investor</span>}
          </p>
          <p className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
            {profile.firm_name ?? "—"} · {profile.user_id.slice(0, 8)}…
          </p>
        </div>
        {saved && (
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "hsl(var(--signal-green) / 0.12)", color: "hsl(var(--signal-green))" }}
          >
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      {/* Access tier toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          Access tier:
        </span>
        <div
          className="flex rounded-lg p-0.5 gap-0.5"
          style={{ background: "hsl(var(--surface-2))" }}
        >
          {(["observer", "full"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTierChange(t)}
              disabled={isPending}
              className="px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-200"
              style={{
                background: tier === t ? "hsl(var(--primary))" : "transparent",
                color: tier === t
                  ? "hsl(var(--primary-foreground))"
                  : "hsl(var(--muted-foreground))",
              }}
            >
              {isPending && tier !== t ? <Loader2 className="w-3 h-3 animate-spin inline" /> : t}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        {editingNotes ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Investment context, communication preferences…"
              className="w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none"
              style={{
                background: "hsl(var(--surface-2))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleNotesSave}
                disabled={isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Save notes
              </button>
              <button
                onClick={() => { setEditingNotes(false); setNotes(profile.notes ?? ""); }}
                className="px-3 py-1.5 rounded-lg text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingNotes(true)}
            className="flex items-start gap-1.5 text-left w-full group"
          >
            <Edit2
              className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "hsl(var(--primary))" }}
            />
            <p
              className="text-xs"
              style={{
                color: notes ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground) / 0.5)",
              }}
            >
              {notes || "Click to add notes…"}
            </p>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { data: myProfile, isLoading: profileLoading } = useInvestorProfile();
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();

  // Gate: only full-access investors
  if (!profileLoading && myProfile?.access_tier !== "full") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "hsl(var(--background))" }}
      >
        <div className="text-center">
          <Shield className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(var(--muted-foreground))" }} />
          <p className="font-semibold mb-1">Access Restricted</p>
          <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            This panel is only available to full-access investors.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-xs px-4 py-2 rounded-lg"
            style={{ background: "hsl(var(--surface-2))", color: "hsl(var(--foreground))" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "hsl(var(--background) / 0.92)",
          borderColor: "hsl(var(--border))",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--foreground))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <div className="h-4 w-px" style={{ background: "hsl(var(--border))" }} />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
              <img src={atlasLogo} alt="Atlas Sanctum" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-sm">Admin Panel</span>
          </div>
          <div
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "hsl(var(--primary) / 0.1)" }}
          >
            <Shield className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
              Full Access
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            <h1 className="font-display text-xl font-bold">Investor Profiles</h1>
          </div>
          <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Manage access tiers and notes for all investors in the Atlas Sanctum portal.
          </p>

          {profilesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} />
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((p) => (
                <ProfileRow key={p.id} profile={p} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-2xl border"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            >
              <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No investor profiles found.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
