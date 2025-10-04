// const Redis = require('ioredis');

// const redis = new Redis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
//   // password: process.env.REDIS_PASSWORD, // Uncomment if needed
// });

// // Event listeners for connection status
// // redis.on('connect', () => {
// //   console.log('Redis client is connecting...');
// // });

// redis.on('ready', () => {
//   redis.set('req123', 'req123');
//   console.log('Redis client is ready');
// });

// redis.on('error', (error) => {
//   console.error('Redis error:', error);
// });

// redis.on('close', () => {
//   console.log('Redis connection closed');
// });

// redis.on('reconnecting', () => {
//   console.log('Redis client is reconnecting...');
// });

// redis.on('end', () => {
//   console.log('Redis client connection ended');
// });


// module.exports = redis;