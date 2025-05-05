import path from "path";
import { extractTextFromDocx } from "../utils/docxReader";
import { ChatOpenAI } from "@langchain/openai";
import { searchWeb } from "../utils/webSearch";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const analyzeToneOfVoice = async () => {
  try {
    const filePath = path.resolve(__dirname, "../data/Schwarz.docx");
    const text = await extractTextFromDocx(filePath);

    const extractionPrompt = `
From the following text, identify:
1. Company or organization name
2. A short brand description if mentioned (e.g. mission, values, tone).

Respond in JSON:
{
  "company": "...",
  "brandSummary": "..."
}

Text:
${text}
    `;

    const extractResponse = await model.call([
      { role: "user", content: extractionPrompt },
    ]);
    let companyName = "Unknown";
    let brandSummary = "";

    try {
      const parsed = JSON.parse(extractResponse.content as string);
      companyName = parsed.company || companyName;
      brandSummary = parsed.brandSummary || "";
    } catch {
      console.warn("⚠️ Could not parse brand info.");
    }

    const articles = await searchWeb(companyName);
    const articleText = articles.join("\n\n").slice(0, 1500);

    const prompt = `
You are a tone and brand expert.

The following context is for your understanding only:
---
Brand summary: ${brandSummary}
Web articles: ${articleText}
---

Now, analyze the tone of voice used in this main content:
---
${text}
---

Respond in JSON:
{
  "tone": "...",
  "language_style": "...",
  "emotional_appeal": "...",
  "formality": "...",
  "key_indicators": ["...", "..."]
}
`;

    const analysisResponse = await model.call([
      { role: "user", content: prompt },
    ]);

    let toneSignature;
    try {
      toneSignature = JSON.parse(analysisResponse.content as string);
    } catch {
      toneSignature = { rawOutput: analysisResponse.content };
    }

    return { companyName, toneSignature };
  } catch (error) {
    console.error(
      "Tone analysis failed:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Failed to analyze tone of voice.");
  }
};
