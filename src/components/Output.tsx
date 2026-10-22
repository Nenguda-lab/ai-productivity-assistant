import { useEffect, useState } from "react";
import { Copy, RefreshCw, Check, Loader2 } from "lucide-react";
import { Card, btnOutlineCls } from "./Shell";
import { loadItem, saveItem } from "@/lib/ai";

export function Output({
  storageKey, value, setValue, loading, error, onRegenerate,
}: {
  storageKey: string; value: string; setValue: (v: string) => void;
  loading: boolean; error: string; onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { setValue(loadItem(storageKey)); }, [storageKey]); // eslint-disable-line
  const update = (v: string) => { setValue(v); saveItem(storageKey, v); };

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h2 className="font-semibold">Result <span className="text-xs font-normal text-muted-foreground">(editable, auto-saved)</span></h2>
        <div className="flex gap-2">
          <button className={btnOutlineCls} disabled={!value}
            onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
          </button>
          <button className={btnOutlineCls} disabled={loading || !value} onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4" /> Regenerate
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mb-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="grid place-items-center h-64 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <textarea aria-label="Generated result" value={value} onChange={(e) => update(e.target.value)}
          placeholder="Your result will appear here."
          className="min-h-80 w-full flex-1 rounded-lg border border-input bg-background p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring" />
      )}
    </Card>
  );
}

export function useRun(storageKey: string) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = async (fn: () => Promise<string>) => {
    setLoading(true); setError("");
    try { const r = await fn(); setValue(r); saveItem(storageKey, r); }
    catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  return { value, setValue, loading, error, run };
}
