require('dotenv').config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];

// Validate that critical env variables are defined
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`\n======================================================`);
    console.error(`FATAL STARTUP ERROR: Environment variable "${key}" is missing.`);
    console.error(`Please define it in your .env file or host environment.`);
    console.error(`======================================================\n`);
    throw new Error(`CRITICAL CONFIG ERROR: Missing environment variable: ${key}`);
  }
});

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoose: {
    uri: process.env.MONGO_URI,
    options: {
      maxPoolSize: 50,              // Up to 50 concurrent sockets open
      minPoolSize: 10,              // Minimum 10 active connections kept hot
      socketTimeoutMS: 45000,       // Fast fail-fast connection timeouts on slow networks
      autoIndex: process.env.NODE_ENV !== 'production', // Disable auto-indexing in production to avoid collection locks
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '24h',
  },
};

module.exports = config;
