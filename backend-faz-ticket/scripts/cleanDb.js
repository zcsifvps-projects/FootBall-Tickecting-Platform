const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from the repo .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Run the existing script (which expects MONGODB_URI to be set)
require(path.resolve(__dirname, "..", "cleanDb.js"));
