import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import atlasLogo from "@/assets/atlas-logo.png";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (err) setError(err.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "hsl(var(--background))" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-4" style={{ background: "hsl(var(--surface-2))" }}>
            <img src={atlasLogo} alt="Atlas Sanctum" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Atlas Sanctum</h1>
          <p className="text-sm text-muted-foreground mt-1">Investor Portal · Confidential</p>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "hsl(var(--surface-1))", borderColor: "hsl(var(--border))" }}>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(var(--signal-green))" }} />
              <p className="font-medium mb-1">Check your inbox</p>
              <p className="text-sm text-muted-foreground">We sent a magic link to <strong>{email}</strong>. Click the link to access the dashboard.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium mb-3">Sign in with magic link</p>
                <p className="text-xs text-muted-foreground">Enter your investor email and we'll send a secure login link — no password required.</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@firm.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none border transition-colors"
                    style={{ background: "hsl(var(--surface-2))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                  />
                </div>
              </div>
              {error && <p className="text-xs" style={{ color: "hsl(var(--signal-red))" }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Send Magic Link
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">Access restricted to invited investors only</p>
      </div>
    </div>
  );
}
