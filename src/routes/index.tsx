import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, CalendarCheck, Search, ArrowRight } from "lucide-react";
import { Card, PageHeader } from "@/components/Shell";
import { loadItem, loadSettings, type Settings } from "@/lib/ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkMate AI Productivity Assistant" },
      { name: "description", content: "AI assistant for emails, task planning and research." },
      { property: "og:title", content: "WorkMate AI Productivity Assistant" },
      { property: "og:description", content: "AI assistant for emails, task planning and research." },
    ],
  }),
  component: Index,
});

const tools = [
  { to: "/email", title: "Email Generator", desc: "Draft professional emails in any tone.", icon: Mail, key: "wpa-email" },
  { to: "/tasks", title: "Task Planner", desc: "Turn tasks into a realistic schedule.", icon: CalendarCheck, key: "wpa-tasks" },
  { to: "/research", title: "Research Assistant", desc: "Summarize topics and articles.", icon: Search, key: "wpa-research" },
] as const;

function Index() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setS(loadSettings());
    setSaved(Object.fromEntries(tools.map((t) => [t.key, !!loadItem(t.key)])));
  }, []);
  return (
    <>
      <PageHeader title={`Welcome${s?.name ? `, ${s.name}` : ""} 👋`} subtitle="Your AI workplace assistant. What would you like to get done today?" />
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card><p className="text-sm text-muted-foreground">AI status</p><p className="text-xl font-semibold mt-1">Built-in & ready</p></Card>
        <Card><p className="text-sm text-muted-foreground">Saved results</p><p className="text-xl font-semibold mt-1">{Object.values(saved).filter(Boolean).length} / 3</p></Card>
        <Card><p className="text-sm text-muted-foreground">Tools</p><p className="text-xl font-semibold mt-1">3</p></Card>
      </div>
      <h2 className="font-semibold mb-3">Quick actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-lift">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary mb-3"><t.icon className="h-5 w-5" /></div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {saved[t.key] ? "Continue" : "Start"} <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
