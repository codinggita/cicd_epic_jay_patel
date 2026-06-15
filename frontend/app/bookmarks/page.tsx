'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useToastStore } from '../../store/toastStore';
import { useAuth } from '../../hooks/useAuth';
import { useKnowledge } from '../../hooks/useKnowledge';
import { 
  Bookmark, 
  Trash2, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Heart, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

export default function BookmarksPage() {
  const { addToast } = useToastStore();
  const { useUserProfileQuery } = useAuth();
  const { useToggleBookmarkMutation } = useKnowledge();

  // Fetch full user profile with populated bookmarks
  const { data: userProfile, isLoading, isError } = useUserProfileQuery(true);

  // Toggle/remove bookmark mutation
  const removeBookmarkMutation = useToggleBookmarkMutation();

  const bookmarksList = userProfile?.bookmarks || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Banner / Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-2.5">
              <Bookmark className="w-7 h-7 text-indigo-500 fill-indigo-500/20" /> Saved Bookmarks
            </h1>
            <p className="text-sm text-slate-400">
              Browse production-ready configurations and guidelines bookmarked from the global registry.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 max-w-max">
            Total Saved: <span className="text-indigo-400">{bookmarksList.length}</span>
          </div>
        </div>

        {/* Catalog Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        ) : isError ? (
          <div className="glass p-8 rounded-xl border border-rose-950/40 text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-bold text-lg">Failed to retrieve bookmarked guides</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify your connection to the server database or try logging in again to authenticate.
            </p>
          </div>
        ) : bookmarksList.length === 0 ? (
          <div className="glass p-12 rounded-2xl border border-slate-900 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Bookmark className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">No saved guides yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start searching the DevOpsPulse catalog and click the bookmark badge to store resources here.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/10 transition-all cursor-pointer"
            >
              Explore Registry <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {bookmarksList.map((guide: any) => (
              <Card 
                key={guide._id} 
                className="glass hover:scale-[1.01] hover:border-slate-750 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] tracking-wider uppercase font-extrabold px-2 py-0.5 rounded">
                      {guide.topic}
                    </span>
                    <button
                      onClick={() => removeBookmarkMutation.mutate(guide._id, {
                        onSuccess: () => {
                          addToast('Bookmark removed successfully', 'info');
                        }
                      })}
                      disabled={removeBookmarkMutation.isPending}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Link href={`/knowledge/${guide._id}`} className="block mt-2">
                    <CardTitle className="text-sm font-bold leading-relaxed line-clamp-2 hover:text-indigo-400 transition-colors">
                      {guide.instruction}
                    </CardTitle>
                  </Link>
                </CardHeader>

                <CardContent className="pt-0 pb-4 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-3.5">
                    <span className="flex items-center gap-1 capitalize">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" /> {guide.difficulty}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" /> {guide.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-slate-500" /> {guide.likes}
                      </span>
                    </div>
                  </div>

                  <Link href={`/knowledge/${guide._id}`} className="block">
                    <button className="w-full flex items-center justify-center gap-1 text-xs font-semibold bg-slate-900 border border-slate-850 hover:bg-slate-850 text-indigo-400 py-2 rounded-lg transition-all cursor-pointer">
                      View Blueprint <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
