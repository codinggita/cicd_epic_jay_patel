'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bookmark, 
  Cpu, 
  HardDrive, 
  Layers, 
  DollarSign, 
  Flame, 
  CheckCircle,
  Activity,
  Terminal,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, useSessionsQuery } = useAuth();
  const { useAnalyticsSummaryQuery, useAnalyticsCostsQuery, useCloudUsageQuery, useTopToolsQuery, useSuccessRateQuery } = useAnalytics();

  // 1. Fetch Analytics Summary
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummaryQuery();

  // 2. Fetch Cost Analytics
  const { data: costs, isLoading: loadingCosts } = useAnalyticsCostsQuery();

  // 3. Fetch Cloud Consumption
  const { data: cloudUsage, isLoading: loadingCloud } = useCloudUsageQuery();

  // 4. Fetch Top Tools
  const { data: topTools = [], isLoading: loadingTools } = useTopToolsQuery();

  // 5. Fetch Success Rates
  const { data: successRate, isLoading: loadingSuccess } = useSuccessRateQuery();

  // 6. Fetch Active Sessions
  const { data: sessions = [], isLoading: loadingSessions } = useSessionsQuery();

  // Helpers: Format uptime
  const formatUptime = (seconds: number = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
        
        {/* Welcome Dashboard Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-2.5">
              <LayoutDashboard className="w-7 h-7 text-indigo-500" /> Engineer Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Welcome back, <span className="text-white font-semibold">{user?.name || 'Engineer'}</span>. Monitoring cloud resource states and compiled template activity metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-850 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">System Health: {summary?.healthState || 'ONLINE'}</span>
          </div>
        </div>

        {/* Top Analytics Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="glass border-slate-800/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Total Catalog Guides</span>
                <p className="text-2xl font-bold text-white">
                  {loadingSummary ? <Skeleton className="h-7 w-12" /> : summary?.totalGuides || 0}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-slate-800/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Success Rate</span>
                <p className="text-2xl font-bold text-emerald-400">
                  {loadingSuccess ? <Skeleton className="h-7 w-12" /> : `${successRate?.successRatePercent || 96.5}%`}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-slate-800/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">Monthly Est. Cost</span>
                <p className="text-2xl font-bold text-white">
                  {loadingCosts ? <Skeleton className="h-7 w-16" /> : `$${costs?.estimatedMonthlyCostUsd || '0.00'}`}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-slate-800/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">System Uptime</span>
                <p className="text-2xl font-bold text-white">
                  {loadingSummary ? <Skeleton className="h-7 w-20" /> : formatUptime(summary?.systemUptimeSeconds)}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cloud Resource Utilization and Cost Distribution */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cloud Capacity Utilization */}
            <Card className="glass border-slate-800/80 shadow-xl">
              <CardHeader className="border-b border-slate-900 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <div>
                      <CardTitle className="text-base font-bold">Mock Cloud Resource Utilization</CardTitle>
                      <CardDescription className="text-xs">Capacity thresholds allocated for local runner processes.</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {loadingCloud ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                  </div>
                ) : (
                  <>
                    {/* CPU Utilization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" /> CPU Allocation
                        </span>
                        <span className="text-white">{cloudUsage?.cpuCoresCapacity || 8} Cores</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all" 
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>45% Current Load</span>
                        <span>Capacity Limit: 8 Cores</span>
                      </div>
                    </div>

                    {/* Memory Utilization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Layers className="w-3.5 h-3.5 text-violet-400" /> Memory Consumption
                        </span>
                        <span className="text-white">{cloudUsage?.memoryUsageMB || 1024} MB</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all" 
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>60% Current Allocation</span>
                        <span>Capacity Limit: 2048 MB</span>
                      </div>
                    </div>

                    {/* Storage Utilization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Docker Volume Cache
                        </span>
                        <span className="text-white">{cloudUsage?.storageUsageGB || 2.4} GB</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all" 
                          style={{ width: '24%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>24% Space Occupied</span>
                        <span>Capacity Limit: 10 GB</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Cloud Costs Distribution */}
            <Card className="glass border-slate-800/80 shadow-xl">
              <CardHeader className="border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-500" />
                  <div>
                    <CardTitle className="text-base font-bold">Estimated Cost Allocation</CardTitle>
                    <CardDescription className="text-xs">Mock subscription cost mapping by primary host platforms.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {loadingCosts ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full rounded" />
                    <Skeleton className="h-6 w-full rounded" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-850 text-center space-y-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">AWS</span>
                      <p className="text-xl font-bold text-white">${costs?.providerCosts?.aws || '0.00'}</p>
                      <p className="text-[10px] text-slate-500">Estimated usage quota</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-850 text-center space-y-1">
                      <span className="text-[10px] font-bold text-violet-400 uppercase">GCP</span>
                      <p className="text-xl font-bold text-white">${costs?.providerCosts?.gcp || '0.00'}</p>
                      <p className="text-[10px] text-slate-500">Cloud database metrics</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-850 text-center space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Azure</span>
                      <p className="text-xl font-bold text-white">${costs?.providerCosts?.azure || '0.00'}</p>
                      <p className="text-[10px] text-slate-500">Storage repositories</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Top Tools & Sessions Shortcut */}
          <div className="space-y-8">
            
            {/* Top Configured DevOps Tools */}
            <Card className="glass border-slate-800/80 shadow-xl">
              <CardHeader className="border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-indigo-400" />
                  <div>
                    <CardTitle className="text-base font-bold">Top DevOps Tools</CardTitle>
                    <CardDescription className="text-xs">Highest queried tags inside our catalog.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingTools ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full rounded" />
                    <Skeleton className="h-6 w-full rounded" />
                  </div>
                ) : topTools.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-2">No tags queried yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topTools.map((tool) => (
                      <div key={tool.name} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-350 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded capitalize">
                          {tool.name}
                        </span>
                        <span className="text-slate-500">{tool.count} requests</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Bookmark Shortcut */}
            <Card className="glass border-slate-800/80 shadow-xl">
              <CardHeader className="border-b border-slate-900 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-indigo-400" />
                    <CardTitle className="text-base font-bold">My Workspace</CardTitle>
                  </div>
                  <Link href="/bookmarks" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5">
                    View <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage pipeline configurations that you bookmarked for local runs or terminal outputs validation tests.
                </p>
                
                <Link href="/bookmarks" className="block">
                  <button className="w-full text-xs font-bold py-2 bg-indigo-650 hover:bg-indigo-600 border border-indigo-600/35 text-white rounded-lg transition-all cursor-pointer">
                    Manage Saved Items
                  </button>
                </Link>
              </CardContent>
            </Card>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
