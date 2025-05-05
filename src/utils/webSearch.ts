// src/utils/webSearch.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export const searchWeb = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(response.data);
    const results: string[] = [];

    $('a.result__a').each((_, el) => {
      const title = $(el).text().trim();
      results.push(title);
    });

    return results;
  } catch (error) {
    console.error('Error during DuckDuckGo search:', error);
    return [];
  }
};
