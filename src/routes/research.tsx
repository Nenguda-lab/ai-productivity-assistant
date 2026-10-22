import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { Card, Field, PageHeader, btnCls, inputCls } from "@/components/Shell";
import { Output, useRun } from "@/components/Output";
import { generate } from "@/lib/ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkMate AI" },
      { name: "description", content: "Summaries, key insights, recommendations and action points from any topic or article." },
      { property: "og:title", content: "AI Research Assistant — WorkMate AI" },
      { property: "og:description", content: "Structured research summaries powered by AI." },
    ],
  }),
  component: ResearchPage,
});

const modes = ["Topic", "Article", "URL"] as const;

function ResearchPage() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Topic");
  const [input, setInput] = useState("");
  const o = useRun("wpa-research");

  const go = () =>
    o.run(() => {
      const urlNote = mode === "URL"
        ? "IMPORTANT: You cannot access the internet. Begin your answer with: 'Note: I could not access this URL. The analysis below is based only on general knowledge and the URL text itself, and may be inaccurate.'"
        : "";
      return generate(
        `You are a careful research analyst. ${urlNote} Respond in plain text with these headings: SUMMARY, KEY INSIGHTS (bullets), RECOMMENDATIONS (bullets), ACTION POINTS (numbered). Be factual; say when you are uncertain.`,
        `${mode}:\n${input}`,
      );
    });

  return (
    <>
      <PageHeader title="AI Research Assistant" subtitle="Get structured summaries, insights and next steps." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); go(); }}>
            <div role="tablist" className="inline-flex rounded-lg border p-1 gap-1">
              {modes.map((m) => (
                <button type="button" role="tab" aria-selected={mode === m} key={m} onClick={() => setMode(m)}
                  className={`rounded-md px-3 py-1.5 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{m}</button>
              ))}
            </div>
            <Field label={mode === "Topic" ? "Research topic" : mode === "Article" ? "Paste article text" : "Article URL"}>
              {mode === "Article" ? (
                <textarea required rows={10} className={inputCls} value={input} onChange={(e) => setInput(e.target.value)} />
              ) : (
                <input required type={mode === "URL" ? "url" : "text"} className={inputCls} value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "URL" ? "https://…" : "e.g. Remote work productivity trends"} />
              )}
            </Field>
            {mode === "URL" && (
              <p className="flex gap-2 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" /> This app can't open web pages. The AI only sees the URL text, so results may be inaccurate — paste the article for a reliable summary.
              </p>
            )}
            <button className={`${btnCls} w-full`} disabled={o.loading}><Sparkles className="h-4 w-4" /> Analyze</button>
          </form>
        </Card>
        <Output storageKey="wpa-research" {...o} onRegenerate={go} />
      </div>
    </>
  );
}
