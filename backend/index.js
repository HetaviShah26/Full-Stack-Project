const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(cors())

// Routes - Load routes before MongoDB connection to catch any import errors early
let Routes;
try {
    Routes = require("./routes/route.js");
    app.use('/', Routes);
    console.log("✅ Routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading routes:", error.message);
    process.exit(1);
}

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("⚠️  WARNING: MONGO_URL is not defined in .env file");
    console.error("Server will start but MongoDB features will not work.");
    console.error("Please create a .env file with: MONGO_URL=your_connection_string");
    // Start server anyway for testing
    startServer();
} else {
    mongoose
        .connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("✅ Connected to MongoDB");
            startServer();
        })
        .catch((err) => {
            console.error("❌ MongoDB connection error:", err.message);
            console.error("Server will start but database features will not work.");
            // Start server anyway - don't crash if MongoDB is unavailable
            startServer();
        });
}

// Start server function
function startServer() {
    const server = app.listen(PORT, () => {
        console.log(`✅ Server started at port no. ${PORT}`)
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use.`);
            console.error("Please stop the other process or change the PORT in .env file");
        } else {
            console.error("❌ Server error:", err.message);
        }
        process.exit(1);
    });
}