import { api } from '../lib/api';
import { AnalyticsSummary } from '../types';

export const analyticsService = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await api.get('/analytics/summary');
    return response.data.data;
  },

  getFailures: async (): Promise<any> => {
    const response = await api.get('/analytics/failures');
    return response.data.data;
  },

  getSuccessRate: async (): Promise<any> => {
    const response = await api.get('/analytics/success-rate');
    return response.data.data;
  },

  getDeployments: async (): Promise<any> => {
    const response = await api.get('/analytics/deployments');
    return response.data.data;
  },

  getBuildTimes: async (): Promise<any> => {
    const response = await api.get('/analytics/build-times');
    return response.data.data;
  },

  getTopTools: async (): Promise<{ name: string; count: number }[]> => {
    const response = await api.get('/analytics/top-tools');
    return response.data.data.tools || [];
  },

  getTopErrors: async (): Promise<any> => {
    const response = await api.get('/analytics/top-errors');
    return response.data.data;
  },

  getUsage: async (): Promise<any> => {
    const response = await api.get('/analytics/usage');
    return response.data.data;
  },

  getTrending: async (): Promise<any> => {
    const response = await api.get('/analytics/trending');
    return response.data.data;
  },

  getLatest: async (): Promise<any> => {
    const response = await api.get('/analytics/latest');
    return response.data.data;
  },

  getGrowth: async (): Promise<any> => {
    const response = await api.get('/analytics/growth');
    return response.data.data;
  },

  getPerformance: async (): Promise<any> => {
    const response = await api.get('/analytics/performance');
    return response.data.data;
  },

  getSecurity: async (): Promise<any> => {
    const response = await api.get('/analytics/security');
    return response.data.data;
  },

  getCosts: async (): Promise<any> => {
    const response = await api.get('/analytics/costs');
    return response.data.data;
  },

  getCloudUsage: async (): Promise<any> => {
    const response = await api.get('/analytics/cloud-usage');
    return response.data.data;
  },
};
