
import type { NewsArticle } from '../types';

/**
 * NOTE: The NewsAPI developer plan does not allow requests from deployed browsers
 * (only from localhost). To make this application work on platforms like Netlify,
 * the direct API call has been disabled. The analysis will proceed using the
 * language model's internal knowledge without real-time news articles.
 *
 * In a real-world scenario, this would be solved by creating a backend proxy
 * (e.g., a serverless function) to securely call the NewsAPI.
 */
export const fetchNews = async (): Promise<NewsArticle[]> => {
  console.warn("News fetching is disabled for deployed environments. The analysis will use the AI's internal knowledge instead. See services/newsService.ts for details.");
  // Return an empty array to signal that no news was fetched.
  return Promise.resolve([]);
};
