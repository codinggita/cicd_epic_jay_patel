const analyticsService = require('../services/analyticsService');
const response = require('../utils/response');
const catchAsync = require('../utils/catchAsync');

/**
 * Summary stats
 * GET /api/v1/analytics/summary
 */
const getSummary = catchAsync(async (req, res) => {
  const summary = await analyticsService.getSummary();
  return res.status(200).json(
    response.success('Analytics summary fetched successfully', summary)
  );
});

/**
 * Pipeline failure analytics
 * GET /api/v1/analytics/failures
 */
const getFailures = catchAsync(async (req, res) => {
  const failures = await analyticsService.getFailures();
  return res.status(200).json(
    response.success('Pipeline failures analytics fetched successfully', failures)
  );
});

/**
 * Success rate
 * GET /api/v1/analytics/success-rate
 */
const getSuccessRate = catchAsync(async (req, res) => {
  const rate = await analyticsService.getSuccessRate();
  return res.status(200).json(
    response.success('Pipeline success rate fetched successfully', rate)
  );
});

/**
 * Deployments
 * GET /api/v1/analytics/deployments
 */
const getDeployments = catchAsync(async (req, res) => {
  const deployments = await analyticsService.getDeployments();
  return res.status(200).json(
    response.success('Deployment analytics fetched successfully', deployments)
  );
});

/**
 * Build times
 * GET /api/v1/analytics/build-times
 */
const getBuildTimes = catchAsync(async (req, res) => {
  const times = await analyticsService.getBuildTimes();
  return res.status(200).json(
    response.success('Build duration analytics fetched successfully', times)
  );
});

/**
 * Top tools
 * GET /api/v1/analytics/top-tools
 */
const getTopTools = catchAsync(async (req, res) => {
  const tools = await analyticsService.getTopTools();
  return res.status(200).json(
    response.success('Most popular DevOps tools fetched successfully', { tools })
  );
});

/**
 * Common errors
 * GET /api/v1/analytics/top-errors
 */
const getTopErrors = catchAsync(async (req, res) => {
  const errors = await analyticsService.getTopErrors();
  return res.status(200).json(
    response.success('Most common exceptions fetched successfully', errors)
  );
});

/**
 * API usage
 * GET /api/v1/analytics/usage
 */
const getUsage = catchAsync(async (req, res) => {
  const usage = await analyticsService.getUsage();
  return res.status(200).json(
    response.success('API usage statistics fetched successfully', usage)
  );
});

/**
 * Search trends
 * GET /api/v1/analytics/trending
 */
const getTrending = catchAsync(async (req, res) => {
  const trending = await analyticsService.getTrending();
  return res.status(200).json(
    response.success('Trending guides fetched successfully', { trending })
  );
});

/**
 * Latest analytics
 * GET /api/v1/analytics/latest
 */
const getLatest = catchAsync(async (req, res) => {
  return res.status(200).json(
    response.success('Latest analytics events fetched successfully', {
      events: [
        { event: 'UserLogin', user: 'user@devops.com', timestamp: new Date() },
      ],
    })
  );
});

/**
 * Growth
 * GET /api/v1/analytics/growth
 */
const getGrowth = catchAsync(async (req, res) => {
  const growth = await analyticsService.getGrowth();
  return res.status(200).json(
    response.success('System growth statistics fetched successfully', growth)
  );
});

/**
 * Performance metrics
 * GET /api/v1/analytics/performance
 */
const getPerformance = catchAsync(async (req, res) => {
  const performance = await analyticsService.getPerformance();
  return res.status(200).json(
    response.success('Response time metrics fetched successfully', performance)
  );
});

/**
 * Security threats metrics
 * GET /api/v1/analytics/security
 */
const getSecurity = catchAsync(async (req, res) => {
  const security = await analyticsService.getSecurity();
  return res.status(200).json(
    response.success('Security events metrics fetched successfully', security)
  );
});

/**
 * Cloud consumption costing
 * GET /api/v1/analytics/costs
 */
const getCosts = catchAsync(async (req, res) => {
  const costs = await analyticsService.getCosts();
  return res.status(200).json(
    response.success('Estimated monthly costing metrics fetched successfully', costs)
  );
});

/**
 * Cloud usage specs
 * GET /api/v1/analytics/cloud-usage
 */
const getCloudUsage = catchAsync(async (req, res) => {
  const usage = await analyticsService.getCloudUsage();
  return res.status(200).json(
    response.success('Infrastructural cloud allocation metrics fetched successfully', usage)
  );
});

module.exports = {
  getSummary,
  getFailures,
  getSuccessRate,
  getDeployments,
  getBuildTimes,
  getTopTools,
  getTopErrors,
  getUsage,
  getTrending,
  getLatest,
  getGrowth,
  getPerformance,
  getSecurity,
  getCosts,
  getCloudUsage,
};
