const mongoose = require('mongoose');

let cachedConnection = null; // Cache the MongoDB connection

const connectDB = async () => {
  if (cachedConnection) {
    console.log("Using existing MongoDB connection");
    return cachedConnection;
  }

  try {
    mongoose.set('strictQuery', true); // Suppress Mongoose deprecation warning

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);

    // Cache the connection
    cachedConnection = connection;
    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("Database connection failed");
  }
};

module.exports = connectDB;