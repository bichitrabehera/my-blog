const mongoose = require('mongoose');

let isConnected = false; // Track the database connection status

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        mongoose.set('strictQuery', true);
        const con = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = con.connections[0].readyState === 1; // Check if connected
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new Error("Database connection failed");
    }
};

module.exports = connectDB;