const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection to all analytical endpoints
router.use(protect);

router.get('/summary', analyticsController.getSummary);
router.get('/failures', analyticsController.getFailures);
router.get('/success-rate', analyticsController.getSuccessRate);
router.get('/deployments', analyticsController.getDeployments);
router.get('/build-times', analyticsController.getBuildTimes);
router.get('/top-tools', analyticsController.getTopTools);
router.get('/top-errors', analyticsController.getTopErrors);
router.get('/usage', analyticsController.getUsage);
router.get('/trending', analyticsController.getTrending);
router.get('/latest', analyticsController.getLatest);
router.get('/growth', analyticsController.getGrowth);
router.get('/performance', analyticsController.getPerformance);
router.get('/security', analyticsController.getSecurity);
router.get('/costs', analyticsController.getCosts);
router.get('/cloud-usage', analyticsController.getCloudUsage);

module.exports = router;
