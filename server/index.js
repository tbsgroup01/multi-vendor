const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
require("./src/models");

const PORT = process.env.PORT || 8000;


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();