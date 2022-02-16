export default {
  username: process.env.MONGODB_USERNAME || '',
  password: process.env.MONGODB_PASSWORD || '',
  host: process.env.MONGODB_HOST || 'mongo',
  port: process.env.MONGODB_PORT || 27017,
  database: process.env.MONGODB_DATABASE || '',
};
