import { generateText } from "./ai.functions";

export type Settings = {
  name: string;
};

const KEY = "wpa-settings";
export const defaultSettings: Settings = {
  name: "",
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function loadItem(key: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}
export function saveItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

/** Generates text with the app's built-in AI (server-side; no API key in the browser). */
export async function generate(system: string, user: string): Promise<string> {
  const res = await generateText({ data: { system, user } });
  if (!res.ok) throw new Error(res.error);
  return res.text;
}
