import { useRef, useState } from "react";
import { Download, FileImage, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ExportButton({ targetId }: { targetId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"pdf" | "png" | null>(null);

  const capture = async (): Promise<HTMLCanvasElement> => {
    const { default: html2canvas } = await import("html2canvas");
    const el = document.getElementById(targetId);
    if (!el) throw new Error("Target element not found");
    return html2canvas(el, {
      backgroundColor: "#0e1520",
      scale: 2,
      useCORS: true,
      logging: false,
    });
  };

  const exportPNG = async () => {
    setLoading("png");
    setOpen(false);
    try {
      const canvas = await capture();
      const link = document.createElement("a");
      link.download = "atlas-sanctum-dashboard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const exportPDF = async () => {
    setLoading("pdf");
    setOpen(false);
    try {
      const canvas = await capture();
      const { jsPDF } = await import("jspdf");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save("atlas-sanctum-investor-report.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={!!loading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
        style={{
          background: "hsl(var(--surface-2))",
          borderColor: "hsl(var(--border))",
          color: loading ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
        }}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        {loading ? "Exporting…" : "Export Report"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border overflow-hidden shadow-2xl z-50"
            style={{
              background: "hsl(var(--surface-1))",
              borderColor: "hsl(var(--border))",
            }}
          >
            <button
              onClick={exportPDF}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors"
              style={{ color: "hsl(var(--foreground))" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <Download className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
              Export as PDF
            </button>
            <button
              onClick={exportPNG}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors border-t"
              style={{
                color: "hsl(var(--foreground))",
                borderColor: "hsl(var(--border))",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--surface-2))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <FileImage className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
              Export as PNG
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
