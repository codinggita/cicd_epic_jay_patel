import { useQuery } from '@tanstack/react-query';
import { searchService, SearchParams } from '../services/search.service';

// Query: full-text search with pagination, filters, sort
export function useSearchQuery(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchService.search(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Query: fetch unique tags list
export function useTagsQuery() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: searchService.getTags,
    staleTime: 10 * 60 * 1000,
  });
}

// Query: search autocomplete predictions
export function useAutocompleteQuery(q: string) {
  return useQuery({
    queryKey: ['autocomplete', q],
    queryFn: () => searchService.autocomplete(q),
    enabled: q.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

// Query: fuzzy search
export function useFuzzySearchQuery(q: string) {
  return useQuery({
    queryKey: ['searchFuzzy', q],
    queryFn: () => searchService.fuzzySearch(q),
    enabled: q.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

// Query: exact search
export function useExactSearchQuery(q: string) {
  return useQuery({
    queryKey: ['searchExact', q],
    queryFn: () => searchService.exactSearch(q),
    enabled: !!q,
    staleTime: 5 * 60 * 1000,
  });
}

// Query: suggestions
export function useSuggestionsQuery(q: string) {
  return useQuery({
    queryKey: ['suggestions', q],
    queryFn: () => searchService.getSuggestions(q),
    enabled: q.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
