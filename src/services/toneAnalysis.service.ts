import path from "path";
import { extractTextFromDocx } from "../utils/docxReader";
import { ChatOpenAI } from "@langchain/openai";
import { searchWeb } from "../utils/webSearch";
import fs from "fs/promises"; // To save the result to a file

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

    // Perform web search using the company name
    const articles = await searchWeb(companyName);
    const articleText = articles.join("\n\n").slice(0, 1500); // Limit the text size

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

    // Analyze tone of voice using OpenAI
    const analysisResponse = await model.call([
      { role: "user", content: prompt },
    ]);

    let toneSignature;
    try {
      toneSignature = JSON.parse(analysisResponse.content as string);
    } catch {
      toneSignature = { rawOutput: analysisResponse.content };
    }

    // Define the output path for saving the tone signature
    const outputDir = path.resolve(__dirname, "../output");
    await fs.mkdir(outputDir, { recursive: true }); // Create output folder if it doesn't exist

    const outputFilePath = path.resolve(outputDir, `${companyName}_tone_signature.json`);

    // Save the tone signature to a JSON file
    await fs.writeFile(outputFilePath, JSON.stringify(toneSignature, null, 2), "utf-8");

    return { companyName, toneSignature };
  } catch (error) {
    console.error(
      "Tone analysis failed:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Failed to analyze tone of voice.");
  }
};
