import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FolderOpen, FileText, Settings, ChevronDown, LogOut, User, Bell } from "lucide-react";
import atlasLogo from "@/assets/atlas-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useInvestorProfile } from "@/hooks/useDashboardData";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", active: true },
  { label: "Portfolio", icon: FolderOpen, href: "#", active: false },
  { label: "Reports", icon: FileText, href: "#", active: false },
  { label: "Settings", icon: Settings, href: "#", active: false },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "AS";
}

export default function NavBar() {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { data: profile } = useInvestorProfile();

  const displayName = profile?.full_name ?? "Investor";
  const firmName = profile?.firm_name ?? "Atlas Sanctum";
  const accessTier = profile?.access_tier ?? "observer";
  const initials = getInitials(profile?.full_name);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "hsl(var(--background) / 0.92)",
        borderColor: "hsl(var(--border))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
            style={{ background: "hsl(var(--surface-2))" }}>
            <img src={atlasLogo} alt="Atlas Sanctum" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex items-baseline gap-1.5">
            <span className="font-display font-semibold text-sm tracking-tight">Atlas</span>
            <span
              className="font-display font-semibold text-sm tracking-tight"
              style={{ color: "hsl(var(--primary))" }}
            >
              Sanctum
            </span>
          </div>
          <div
            className="hidden sm:block h-4 w-px mx-1"
            style={{ background: "hsl(var(--border))" }}
          />
          <span
            className="hidden sm:block text-xs font-mono-custom"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Investor Portal
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ label, icon: Icon, href, active }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: active ? "hsl(var(--primary) / 0.12)" : "transparent",
                color: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--surface-2))";
                  (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--foreground))";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--muted-foreground))";
                }
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{label}</span>
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "hsl(var(--signal-green) / 0.1)" }}>
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "hsl(var(--signal-green))" }}
            />
            <span className="text-xs font-medium" style={{ color: "hsl(var(--signal-green))" }}>
              Live
            </span>
          </div>

          {/* Bell */}
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg transition-colors"
              style={{ background: avatarOpen ? "hsl(var(--surface-2))" : "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
              }}
              onMouseLeave={(e) => {
                if (!avatarOpen)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(152, 60%, 34%))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium leading-tight">{displayName}</p>
                <p className="text-xs leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {firmName} · <span className="capitalize">{accessTier}</span>
                </p>
              </div>
              <ChevronDown
                className="w-3 h-3 transition-transform duration-200"
                style={{
                  color: "hsl(var(--muted-foreground))",
                  transform: avatarOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border overflow-hidden shadow-2xl z-50"
                  style={{
                    background: "hsl(var(--surface-1))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <p className="text-xs font-semibold">{displayName}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {firmName}
                    </p>
                    <span
                      className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full capitalize font-medium"
                      style={{
                        background: accessTier === "full"
                          ? "hsl(var(--primary) / 0.15)"
                          : "hsl(var(--surface-3))",
                        color: accessTier === "full"
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {accessTier} access
                    </span>
                  </div>
                  {[
                    { icon: User, label: "Profile" },
                    { icon: Settings, label: "Settings" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                      style={{ color: "hsl(var(--foreground))" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
                      {label}
                    </button>
                  ))}
                  <div className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                      style={{ color: "hsl(var(--signal-red))" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--signal-red) / 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
