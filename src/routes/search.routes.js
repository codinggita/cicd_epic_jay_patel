const express = require('express');
const knowledgeController = require('../controllers/knowledgeController');
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');
const response = require('../utils/response');

const router = express.Router();

// General Search & Filter Queries
router.get('/', knowledgeController.search);
router.get('/tags', knowledgeController.getTags);

router.get('/by-tag/:tag', (req, res, next) => {
  req.query.topic = req.params.tag;
  knowledgeController.search(req, res, next);
});

router.get('/popular', (req, res) => {
  return res.status(200).json(
    response.success('Popular searches fetched successfully', ['docker', 'kubernetes ingress', 'jenkins pipeline'])
  );
});

router.get('/recent', (req, res) => {
  return res.status(200).json(
    response.success('Recent searches fetched successfully', ['docker compose', 'helm upgrade', 'terraform aws'])
  );
});

router.get('/autocomplete', (req, res, next) => {
  knowledgeController.autocomplete(req, res, next);
});

router.get('/fuzzy', (req, res, next) => {
  knowledgeController.fuzzySearch(req, res, next);
});

router.get('/exact', (req, res, next) => {
  knowledgeController.exactSearch(req, res, next);
});

router.get('/category/:name', (req, res, next) => {
  req.query.topic = req.params.name;
  knowledgeController.search(req, res, next);
});

router.get('/language/:lang', (req, res, next) => {
  req.query.q = req.params.lang;
  knowledgeController.search(req, res, next);
});

router.get('/tool/:tool', (req, res, next) => {
  req.query.topic = req.params.tool;
  knowledgeController.search(req, res, next);
});

router.get('/advanced', knowledgeController.search);

router.get('/suggestions', (req, res, next) => {
  knowledgeController.getSuggestions(req, res, next);
});

router.get('/trending', (req, res) => {
  return res.status(200).json(
    response.success('Trending searches fetched successfully', ['github actions docker', 'ansible playbook'])
  );
});

router.get('/filter', knowledgeController.search);

router.get('/yaml', (req, res, next) => {
  req.query.topic = 'yaml';
  req.query.q = 'template';
  knowledgeController.search(req, res, next);
});

router.get('/snippets', (req, res, next) => {
  req.query.q = 'snippet code';
  knowledgeController.search(req, res, next);
});

router.get('/errors', (req, res, next) => {
  req.query.q = 'error troubleshooting crash';
  knowledgeController.search(req, res, next);
});

// Protected Analytics Scopes
router.get('/history', protect, (req, res) => {
  return res.status(200).json(
    response.success('User search history fetched successfully', ['docker run -p', 'kubernetes deployment'])
  );
});

router.get('/recommended', protect, workflowController.getRecommended);

module.exports = router;
