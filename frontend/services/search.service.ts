import { api } from '../lib/api';
import { Knowledge } from '../types';

export interface SearchParams {
  q?: string;
  topic?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface SearchResponse {
  records: Knowledge[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SearchTag {
  name: string;
  count: number;
}

export interface AutocompleteResult {
  _id: string;
  instruction: string;
  topic: string;
}

export const searchService = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get('/search', { params });
    return response.data.data;
  },

  getTags: async (): Promise<SearchTag[]> => {
    const response = await api.get('/search/tags');
    return response.data.data.tags || [];
  },

  autocomplete: async (q: string): Promise<AutocompleteResult[]> => {
    const response = await api.get('/search/autocomplete', { params: { q } });
    return response.data.data.results || [];
  },

  fuzzySearch: async (q: string): Promise<Knowledge[]> => {
    const response = await api.get('/search/fuzzy', { params: { q } });
    return response.data.data.results || [];
  },

  exactSearch: async (q: string): Promise<Knowledge[]> => {
    const response = await api.get('/search/exact', { params: { q } });
    return response.data.data.results || [];
  },

  getSuggestions: async (q: string): Promise<string[]> => {
    const response = await api.get('/search/suggestions', { params: { q } });
    return response.data.data.suggestions || [];
  },
};
