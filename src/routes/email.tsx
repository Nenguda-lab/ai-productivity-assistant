import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, Field, PageHeader, btnCls, inputCls } from "@/components/Shell";
import { Output, useRun } from "@/components/Output";
import { generate } from "@/lib/ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMate AI" },
      { name: "description", content: "Generate personalized professional emails in formal, friendly or persuasive tone." },
      { property: "og:title", content: "Smart Email Generator — WorkMate AI" },
      { property: "og:description", content: "Generate personalized professional emails." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [f, setF] = useState({ recipient: "", subject: "", purpose: "", points: "", tone: "Formal" });
  const o = useRun("wpa-email");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const go = () =>
    o.run(() =>
      generate(
        "You are an expert business communication writer. Write a complete, ready-to-send email. Output format: 'Subject: ...' on the first line, a blank line, then the email body with greeting, clear paragraphs and a sign-off. Do not invent facts beyond the provided key points. Keep it concise.",
        `Recipient: ${f.recipient}\nSubject: ${f.subject || "(suggest one)"}\nPurpose: ${f.purpose}\nKey points:\n${f.points}\nTone: ${f.tone}`,
      ),
    );

  return (
    <>
      <PageHeader title="Smart Email Generator" subtitle="Describe your email and let AI draft it." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); go(); }}>
            <Field label="Recipient"><input required className={inputCls} value={f.recipient} onChange={set("recipient")} placeholder="e.g. Sarah, Head of Marketing" /></Field>
            <Field label="Subject"><input className={inputCls} value={f.subject} onChange={set("subject")} placeholder="Optional" /></Field>
            <Field label="Purpose"><input required className={inputCls} value={f.purpose} onChange={set("purpose")} placeholder="e.g. Request a project update" /></Field>
            <Field label="Key points"><textarea rows={4} className={inputCls} value={f.points} onChange={set("points")} placeholder="One point per line" /></Field>
            <fieldset>
              <legend className="text-sm font-medium mb-1">Tone</legend>
              <div className="flex flex-wrap gap-2">
                {["Formal", "Friendly", "Persuasive"].map((t) => (
                  <button type="button" key={t} aria-pressed={f.tone === t} onClick={() => setF({ ...f, tone: t })}
                    className={`rounded-full border px-4 py-1.5 text-sm ${f.tone === t ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>{t}</button>
                ))}
              </div>
            </fieldset>
            <button className={`${btnCls} w-full`} disabled={o.loading}><Sparkles className="h-4 w-4" /> Generate email</button>
          </form>
        </Card>
        <Output storageKey="wpa-email" {...o} onRegenerate={go} />
      </div>
    </>
  );
}
