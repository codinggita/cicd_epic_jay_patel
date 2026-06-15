'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useSearchQuery, useTagsQuery, useAutocompleteQuery } from '../../hooks/useSearch';
import { Search as SearchIcon, Filter, Eye, ThumbsUp, HelpCircle, ArrowUpDown } from 'lucide-react';

// Helper to decode standard HTML entities
function decodeHTMLEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&#x2F;/g, '/');
}

// Clean and capitalize titles
function cleanInstructionTitle(title: string): string {
  let cleaned = decodeHTMLEntities(title);
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

// Generate readable text preview (150-200 chars max)
function getCleanPreview(output: string): string {
  if (!output) return '';
  let decoded = decodeHTMLEntities(output);
  let cleaned = decoded
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length > 180) {
    return cleaned.substring(0, 180).trim() + '...';
  }
  return cleaned;
}

// Highlight matching search terms dynamically
function highlightMatch(text: string, term: string) {
  if (!term || !term.trim()) return <span>{text}</span>;
  const cleanTerm = term.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${cleanTerm})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 font-bold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local Search Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Debouncing effect for search text inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Sync URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedTerm) params.set('q', debouncedTerm);
    if (topic) params.set('topic', topic);
    if (difficulty) params.set('difficulty', difficulty);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedTerm, topic, difficulty, sort, page, router]);

  // 1. Fetch autocomplete suggestions query
  const { data: autocompleteSuggestions = [] } = useAutocompleteQuery(debouncedTerm);

  // 2. Fetch unique tags query
  const { data: tags = [] } = useTagsQuery();

  // 3. Primary Full Text Search Query
  const { data: searchResults, isLoading } = useSearchQuery({
    q: debouncedTerm || undefined,
    topic: topic || undefined,
    difficulty: difficulty || undefined,
    sort: sort || undefined,
    page,
    limit: 8,
  });

  const records = searchResults?.records || [];
  const totalPages = searchResults?.pagination?.pages || 1;
  const totalResults = searchResults?.pagination?.total || 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top search console block */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Advanced Search</h1>
          
          <div className="relative">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
              <SearchIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter query words, e.g. ingress, Docker cache, Terraform GCP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 py-3.5 px-3 text-sm focus:outline-none dark:text-white"
              />
            </div>
            
            {/* Predictive autocomplete dropdown */}
            {debouncedTerm.length >= 2 && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 glass border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 p-2 flex flex-col gap-0.5 animate-slide-up">
                <span className="text-[10px] font-bold text-slate-400 px-3.5 py-1.5 uppercase">Predictive tags</span>
                {Array.from(
                  new Map(autocompleteSuggestions.map((s) => [s.instruction, s])).values()
                ).slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion._id}
                    onClick={() => {
                      setSearchTerm(suggestion.instruction);
                      setDebouncedTerm(suggestion.instruction);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors pointer-events-auto cursor-pointer"
                  >
                    {suggestion.instruction}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar filters panel */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-3">
              <span className="font-bold text-sm flex items-center gap-2"><Filter className="w-4 h-4" /> Filter Options</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTopic('');
                  setDifficulty('');
                  setSort('latest');
                  setPage(1);
                }}
                className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors pointer-events-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>

            {/* Topic Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Topics</label>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-white"
              >
                <option value="">All Topics</option>
                {tags.map((t) => (
                  <option key={t.name} value={t.name} className="capitalize">
                    {t.name} ({t.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-white"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Sort By</label>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Latest Releases', value: 'latest' },
                  { name: 'Highest Popularity', value: 'popular' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSort(option.value)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all pointer-events-auto cursor-pointer ${
                      sort === option.value
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-400'
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Grid Content */}
          <div className="flex-grow space-y-6 w-full animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-850/60 pb-3 gap-2">
              <span className="text-sm font-bold text-slate-650 dark:text-slate-400 flex items-center gap-2">
                Showing <span className="text-indigo-500 font-extrabold">{totalResults}</span> DevOps blueprints
                {debouncedTerm && (
                  <span className="text-xs font-normal text-slate-450">
                    for &ldquo;<span className="font-semibold text-slate-700 dark:text-slate-350">{debouncedTerm}</span>&rdquo;
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-450">
                <span className="font-medium">Sorting:</span>
                <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
                  {sort === 'latest' ? 'Latest' : 'Most Popular'}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-850 rounded-full" />
                    </div>
                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-850 rounded" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-850 rounded" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-850 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-xl space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
                <HelpCircle className="w-14 h-14 text-indigo-500/80 mx-auto animate-pulse" />
                <div className="space-y-1 relative z-10">
                  <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-200">No DevOps blueprints found</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    We couldn't locate any matching configurations. Try refining your keywords or clearing topic filters to try again.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTopic('');
                    setDifficulty('');
                    setSort('latest');
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {records.map((guide) => {
                  const cleanedTitle = cleanInstructionTitle(guide.instruction);
                  const cleanedPreview = getCleanPreview(guide.output);
                  
                  return (
                    <Link key={guide._id} href={`/knowledge/${guide._id}`} className="block h-full group">
                      <Card className="hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer h-full flex flex-col justify-between hover:border-indigo-500/40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider">
                              {guide.topic}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border capitalize ${
                              guide.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                              guide.difficulty === 'intermediate' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' :
                              guide.difficulty === 'advanced' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            }`}>
                              {guide.difficulty}
                            </span>
                          </div>
                          <CardTitle className="text-base font-extrabold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-500 transition-colors">
                            {highlightMatch(cleanedTitle, debouncedTerm)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                            {highlightMatch(cleanedPreview, debouncedTerm)}
                          </p>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-slate-850/80 text-xs text-slate-500 dark:text-slate-400 mt-auto">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Eye className="w-4 h-4 text-slate-400" /> {guide.views}
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <ThumbsUp className="w-3.5 h-3.5 text-slate-400" /> {guide.likes}
                              </span>
                            </div>
                            <span className="font-medium text-slate-450">
                              {new Date(guide.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:underline pt-1 self-start">
                            <span>Explore guide</span>
                            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) }

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 transition-all pointer-events-auto cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs font-medium px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 transition-all pointer-events-auto cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-slate-400">
          Loading catalog registry search modules...
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
