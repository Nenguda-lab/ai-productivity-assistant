import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Sparkles } from "lucide-react";
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
          <div className="flex gap-2 items-center">
            <button className={btnCls} onClick={save}><Save className="h-4 w-4" /> Save</button>
            <button className={btnOutlineCls} onClick={() => { localStorage.clear(); setS(defaultSettings); setMsg("All local data cleared."); }}>Clear all data</button>
            <span role="status" className="text-sm text-primary">{msg}</span>
          </div>
        </Card>
        <Card className="space-y-3 text-sm">
          <h2 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> About the AI</h2>
          <p className="text-muted-foreground">This app uses built-in Lovable AI that runs securely on the server — no API key is needed, and nothing secret is ever stored in your browser.</p>
          <p className="text-muted-foreground">Every result is generated live by the AI from your inputs. Your preferences and results are saved only in this browser's local storage.</p>
          <p className="text-muted-foreground">AI outputs may contain errors. Review everything before professional use.</p>
        </Card>
      </div>
    </>
  );
}
