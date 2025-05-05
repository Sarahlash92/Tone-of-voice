import { PromptTemplate } from "@langchain/core/prompts";

export const toneAnalysisPrompt = new PromptTemplate({
  template: `Extract the tone, language style, formality, forms of address, emotional appeal, and classification from the following text: {text}`,
  inputVariables: ['text'],
});
