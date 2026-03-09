import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, CheckCircle, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import atlasLogo from "@/assets/atlas-logo.png";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

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

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setResending(false);
    if (!err) {
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none"
        style={{ background: "hsl(var(--signal-blue))" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo + brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-4 ring-1"
          style={{
              background: "hsl(var(--surface-2))",
              boxShadow: "0 0 32px hsl(var(--primary) / 0.15)",
            }}
          >
            <img src={atlasLogo} alt="Atlas Sanctum" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Atlas Sanctum</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Investor Portal · Confidential
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border p-6 shadow-2xl"
          style={{
            background: "hsl(var(--surface-1))",
            borderColor: "hsl(var(--border))",
            boxShadow: "0 24px 80px hsl(0 0% 0% / 0.35), 0 0 0 1px hsl(var(--border))",
          }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "hsl(var(--signal-green) / 0.12)" }}
                  >
                    <CheckCircle className="w-7 h-7" style={{ color: "hsl(var(--signal-green))" }} />
                  </div>
                </motion.div>
                <h2 className="font-display font-semibold text-base mb-1">Check your inbox</h2>
                <p className="text-sm mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Magic link sent to
                </p>
                <p
                  className="text-sm font-medium mb-5 px-3 py-1.5 rounded-lg inline-block"
                  style={{
                    background: "hsl(var(--surface-2))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {email}
                </p>
                <p className="text-xs mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Click the link in your email to access the dashboard. The link expires in 1 hour.
                </p>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Didn't receive it?
                  </span>
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{
                      color: resent ? "hsl(var(--signal-green))" : "hsl(var(--primary))",
                    }}
                  >
                    {resending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    {resent ? "Sent!" : "Resend link"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <div>
                  <h2 className="font-display text-sm font-semibold mb-1">Sign in with magic link</h2>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Enter your investor email — we'll send a secure, passwordless link.
                  </p>
                </div>

                <div>
                  <label
                    className="text-xs font-medium block mb-1.5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="investor@firm.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none border transition-all"
                      style={{
                        background: "hsl(var(--surface-2))",
                        borderColor: error ? "hsl(var(--signal-red) / 0.6)" : "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      }}
                      onFocus={(e) => {
                        if (!error) e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = error
                          ? "hsl(var(--signal-red) / 0.6)"
                          : "hsl(var(--border))";
                      }}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg overflow-hidden"
                      style={{
                        background: "hsl(var(--signal-red) / 0.08)",
                        color: "hsl(var(--signal-red))",
                        border: "1px solid hsl(var(--signal-red) / 0.2)",
                      }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: loading || !email
                      ? "hsl(var(--primary) / 0.5)"
                      : "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    cursor: loading || !email ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs mt-4"
          style={{ color: "hsl(var(--muted-foreground) / 0.6)" }}
        >
          Access restricted to invited investors only
        </motion.p>
      </motion.div>
    </div>
  );
}
