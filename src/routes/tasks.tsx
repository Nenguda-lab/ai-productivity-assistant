import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Card, Field, PageHeader, btnCls, btnOutlineCls, inputCls } from "@/components/Shell";
import { generate, loadItem, saveItem } from "@/lib/ai";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMate AI" },
      { name: "description", content: "Turn tasks, deadlines and priorities into a realistic daily or weekly schedule." },
      { property: "og:title", content: "AI Task Planner — WorkMate AI" },
      { property: "og:description", content: "Generate realistic schedules with prioritized time blocks." },
    ],
  }),
  component: TasksPage,
});

type Task = { name: string; deadline: string; priority: string };
type Item = { text: string; done: boolean };

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([{ name: "", deadline: "", priority: "High" }]);
  const [hours, setHours] = useState(6);
  const [range, setRange] = useState("Daily");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { try { setItems(JSON.parse(loadItem("wpa-tasks", "[]"))); } catch { /* ignore */ } }, []);
  const persist = (v: Item[]) => { setItems(v); saveItem("wpa-tasks", JSON.stringify(v)); };
  const upd = (i: number, k: keyof Task, v: string) => setTasks(tasks.map((t, j) => (j === i ? { ...t, [k]: v } : t)));

  const go = async () => {
    const valid = tasks.filter((t) => t.name.trim());
    if (!valid.length) return setError("Add at least one task.");
    setLoading(true); setError("");
    try {
      const out = await generate(
        `You are a realistic productivity planner. Build a ${range.toLowerCase()} schedule using at most ${hours} focused hours per day, including short breaks. Order by priority and deadline. Output ONLY a list, one item per line, format: "[Day if weekly] HH:MM–HH:MM · Task (Priority)". No intro or extra text. Flag any task that cannot fit with "⚠".`,
        `Today: ${new Date().toDateString()}\nTasks:\n${valid.map((t) => `- ${t.name} | deadline: ${t.deadline || "none"} | priority: ${t.priority}`).join("\n")}`,
      );
      persist(out.split("\n").map((l) => l.replace(/^[-*\d.\s]+(?=\S)/, "").trim()).filter(Boolean).map((text) => ({ text, done: false })));
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader title="AI Task Planner" subtitle="Add your tasks and get a prioritized, time-blocked plan." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          {tasks.map((t, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto] items-end">
              <Field label={`Task ${i + 1}`}><input className={inputCls} value={t.name} onChange={(e) => upd(i, "name", e.target.value)} placeholder="e.g. Finish Q3 report" /></Field>
              <Field label="Deadline"><input type="date" className={inputCls} value={t.deadline} onChange={(e) => upd(i, "deadline", e.target.value)} /></Field>
              <Field label="Priority">
                <select className={inputCls} value={t.priority} onChange={(e) => upd(i, "priority", e.target.value)}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </Field>
              <button aria-label="Remove task" className={btnOutlineCls} onClick={() => setTasks(tasks.filter((_, j) => j !== i))} disabled={tasks.length === 1}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button className={btnOutlineCls} onClick={() => setTasks([...tasks, { name: "", deadline: "", priority: "Medium" }])}><Plus className="h-4 w-4" /> Add task</button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Available hours / day"><input type="number" min={1} max={16} className={inputCls} value={hours} onChange={(e) => setHours(Number(e.target.value))} /></Field>
            <Field label="Schedule"><select className={inputCls} value={range} onChange={(e) => setRange(e.target.value)}><option>Daily</option><option>Weekly</option></select></Field>
          </div>
          {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button className={`${btnCls} w-full`} onClick={go} disabled={loading}><Sparkles className="h-4 w-4" /> {loading ? "Planning…" : "Generate schedule"}</button>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Your schedule <span className="text-xs font-normal text-muted-foreground">(editable checklist)</span></h2>
            {items.length > 0 && <span className="text-sm text-muted-foreground">{items.filter((i) => i.done).length}/{items.length} done</span>}
          </div>
          {items.length === 0 && <p className="text-sm text-muted-foreground">Your plan will appear here.</p>}
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-2">
                <input type="checkbox" aria-label="Done" className="h-4 w-4 accent-primary" checked={it.done} onChange={() => persist(items.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />
                <input className={`${inputCls} ${it.done ? "line-through text-muted-foreground" : ""}`} value={it.text} onChange={(e) => persist(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                <button aria-label="Delete item" onClick={() => persist(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className="mt-4 flex gap-2">
              <button className={btnOutlineCls} onClick={() => persist([...items, { text: "", done: false }])}><Plus className="h-4 w-4" /> Add item</button>
              <button className={btnOutlineCls} onClick={go} disabled={loading}>Regenerate</button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
