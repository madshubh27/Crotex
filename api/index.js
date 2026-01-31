const app = require("../server/app");
const { connectDB } = require("../server/config/database");

// Cache the database connection across invocations
let isConnected = false;

module.exports = async (req, res) => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
        } catch (error) {
            console.error("DB Connection Failed in Serverless Function:", error);
        }
    }

    // Forward request to Express app
    return app(req, res);
};
