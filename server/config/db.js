// database connection
const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  if (process.env.NODE_ENV === 'production' && !customUri && !process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required in production.');
  }

  const uri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/sparein_evaluation';
  try {
    const conn = await mongoose.connect(uri);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
