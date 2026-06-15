import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export function useAnalytics() {
  // Query: compiled dashboard summary totals
  const useAnalyticsSummaryQuery = () => {
    return useQuery({
      queryKey: ['analyticsSummary'],
      queryFn: analyticsService.getSummary,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Query: cloud cost consumption metrics
  const useAnalyticsCostsQuery = () => {
    return useQuery({
      queryKey: ['analyticsCosts'],
      queryFn: analyticsService.getCosts,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Query: cloud resources load usage
  const useCloudUsageQuery = () => {
    return useQuery({
      queryKey: ['analyticsCloud'],
      queryFn: analyticsService.getCloudUsage,
      staleTime: 1 * 60 * 1000,
    });
  };

  // Query: top configured toolchains
  const useTopToolsQuery = () => {
    return useQuery({
      queryKey: ['analyticsTopTools'],
      queryFn: analyticsService.getTopTools,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Query: success and failure run ratios
  const useSuccessRateQuery = () => {
    return useQuery({
      queryKey: ['analyticsSuccessRate'],
      queryFn: analyticsService.getSuccessRate,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    useAnalyticsSummaryQuery,
    useAnalyticsCostsQuery,
    useCloudUsageQuery,
    useTopToolsQuery,
    useSuccessRateQuery,
  };
}
