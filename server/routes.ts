import { Router } from "express";
import OpenAI from "openai";
const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

const getAI = () => {
  const key = process.env.OPENAI_API_KEY;
  return key ? new OpenAI({ apiKey: key }) : null;
};

router.post("/boost", async (req, res) => {
  const topic = String(req.body?.topic ?? "barbers");
  const count = Number(req.body?.count ?? 3);

  const ai = getAI();
  if (!ai) {
    const demo = Array.from({ length: count }, (_, i) => `(${i + 1}) ${topic} — demo line`).join("\n");
    return res.json({ ok: true, text: demo });
  }

  try {
    const r = await ai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "Write 1-line, punchy IG captions. SmartFlow black/brown/gold vibe." },
        { role: "user", content: `Give ${count} lines about ${topic}.` }
      ]
    });
    return res.json({ ok: true, text: r.output_text });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "AI error" });
  }
});

export default router;
