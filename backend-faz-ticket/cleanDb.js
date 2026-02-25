const mongoose = require("mongoose");
const User = require("../models/User");
const Ticket = require("../models/Ticket");

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("🧹 Cleaning database...");
    await User.deleteMany({});
    console.log("✅ All users deleted");
    
    await Ticket.deleteMany({});
    console.log("✅ All tickets deleted");
    
    await mongoose.connection.close();
    console.log("✅ Database cleaned!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

cleanDatabase();
