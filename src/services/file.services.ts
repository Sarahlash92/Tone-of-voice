import * as fs from "fs";
import * as mammoth from "mammoth";

/**
 * Extracts text from a DOCX file.
 * @param filePath - The path to the DOCX file.
 * @returns The extracted text from the DOCX file.
 */
export const extractTextFromDocx = async (
  filePath: string
): Promise<string> => {
  try {
    const data = await fs.promises.readFile(filePath);

    const result = await mammoth.extractRawText({ buffer: data });

    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX file:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};
