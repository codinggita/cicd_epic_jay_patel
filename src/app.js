const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/config');
const swaggerSpec = require('./swagger/swagger');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const { globalLimiter } = require('./middleware/rateLimiters');
const response = require('./utils/response');

const app = express();

// Security Middlewares - Customized Helmet CSP for Swagger UI compatibility
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      },
    },
  })
);

app.use(cors());

// Logging Middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Payload Parsing
app.use(express.json({ limit: '10kb' })); // Restrict standard body payload sizes to prevent Denial of Service attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply Global Rate Limiting to all routes
app.use('/api', globalLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  return res.status(200).json(
    response.success('DevOps Knowledge Platform API is healthy', {
      uptime: process.uptime(),
      timestamp: new Date(),
      status: 'UP',
      env: config.env,
    })
  );
});

// App Router Registry
app.use('/api/v1', routes);

// Handle 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json(
    response.error(`Route not found - ${req.originalUrl}`, {
      status: 404,
    })
  );
});

// Centralized Global Error Handler
app.use(errorMiddleware);

module.exports = app;
