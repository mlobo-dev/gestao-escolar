import { API_BASE_URL } from "../constants";

/**
 * Base API fetcher with common logic for headers and error handling.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) return null;

  return response.json();
};
