require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  console.log('Shutting down server due to uncaught exception...');
  process.exit(1);
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  console.log('Shutting down server due to unhandled promise rejection...');
  server.close(() => {
    process.exit(1);
  });
});
