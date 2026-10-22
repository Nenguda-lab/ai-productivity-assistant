import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, ShieldAlert } from "lucide-react";
import { Card, Field, PageHeader, btnCls, btnOutlineCls, inputCls } from "@/components/Shell";
import { defaultSettings, loadSettings, saveSettings, type Settings } from "@/lib/ai";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkMate AI" },
      { name: "description", content: "Configure your AI provider key, model and preferences." },
      { property: "og:title", content: "Settings — WorkMate AI" },
      { property: "og:description", content: "Configure your AI provider and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<Settings>(defaultSettings);
  const [msg, setMsg] = useState("");
  useEffect(() => setS(loadSettings()), []);
  const save = () => { saveSettings(s); setMsg("Settings saved."); setTimeout(() => setMsg(""), 2000); };

  return (
    <>
      <PageHeader title="Settings" subtitle="Preferences and AI connection." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <Field label="Your name"><input className={inputCls} value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={s.demoMode} onChange={(e) => setS({ ...s, demoMode: e.target.checked })} />
            <span className="text-sm font-medium">Demo mode (labeled sample text, no AI calls)</span>
          </label>
          <Field label="API key (OpenAI-compatible)">
            <input type="password" autoComplete="off" className={inputCls} value={s.apiKey} onChange={(e) => setS({ ...s, apiKey: e.target.value })} placeholder="sk-…" />
          </Field>
          <Field label="Model"><input className={inputCls} value={s.model} onChange={(e) => setS({ ...s, model: e.target.value })} /></Field>
          <Field label="API base URL"><input className={inputCls} value={s.baseUrl} onChange={(e) => setS({ ...s, baseUrl: e.target.value })} /></Field>
          <div className="flex gap-2 items-center">
            <button className={btnCls} onClick={save}><Save className="h-4 w-4" /> Save</button>
            <button className={btnOutlineCls} onClick={() => { localStorage.clear(); setS(defaultSettings); setMsg("All local data cleared."); }}>Clear all data</button>
            <span role="status" className="text-sm text-primary">{msg}</span>
          </div>
        </Card>
        <Card className="space-y-3 text-sm">
          <h2 className="font-semibold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" /> About your key</h2>
          <p className="text-muted-foreground">Your key is stored only in this browser's local storage and sent directly to the provider you configure. Don't use this on shared computers.</p>
          <p className="text-muted-foreground">Turn off demo mode and add a key to get real AI results. Without a key, all outputs are clearly labeled as demo samples.</p>
          <p className="text-muted-foreground">AI outputs may contain errors. Review everything before professional use.</p>
        </Card>
      </div>
    </>
  );
}
