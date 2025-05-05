import * as fs from 'fs/promises';
import * as mammoth from 'mammoth';

export const extractTextFromDocx = async (filePath: string): Promise<string> => {
  const data = await fs.readFile(filePath);
  const { value } = await mammoth.extractRawText({ buffer: data });
  return value;
};
