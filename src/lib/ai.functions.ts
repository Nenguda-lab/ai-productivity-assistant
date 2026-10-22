import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type GenerateResult = { ok: true; text: string } | { ok: false; error: string };

function friendlyError(e: unknown): string {
  if (e instanceof Error && e.message === "AI_NOT_CONFIGURED") {
    return "AI is not configured for this app yet. The app owner needs to finish the AI setup before real results are available.";
  }
  const status =
    typeof e === "object" && e !== null && "statusCode" in e
      ? Number((e as { statusCode?: unknown }).statusCode)
      : undefined;
  if (status === 402) return "This workspace is out of AI credits. Add credits in the project settings to continue.";
  if (status === 429) return "The AI service is busy right now. Please wait a moment and try again.";
  if (status === 401) return "AI is not configured for this app yet. The app owner needs to finish the AI setup.";
  return "The AI request failed. Please try again.";
}

export const generateText = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ system: z.string(), user: z.string() }).parse(data))
  .handler(async ({ data }): Promise<GenerateResult> => {
    try {
      const { generateAiText } = await import("./ai.server.ts");
      return { ok: true, text: await generateAiText(data.system, data.user) };
    } catch (e) {
      console.error("AI generation failed:", e);
      return { ok: false, error: friendlyError(e) };
    }
  });
