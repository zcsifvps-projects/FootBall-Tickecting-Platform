#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const args = process.argv.slice(2);
  const opts = {};
  args.forEach((a) => {
    if (a === "--drop-users") opts.drop = true;
    if (a.startsWith("--delete-domain=")) opts.domain = a.split("=")[1];
    if (a.startsWith("--delete-unverified-days=")) opts.unverifiedDays = Number(a.split("=")[1]);
    if (a.startsWith("--delete-emails=")) opts.deleteEmails = a.split("=")[1].split(",");
    if (a.startsWith("--set-verified=")) opts.setVerified = a.split("=")[1].split(",");
    if (a === "--yes") opts.yes = true;
    if (a === "--dry-run") opts.dry = true;
    if (a === "--help") opts.help = true;
  });

  if (opts.help || Object.keys(opts).length === 0) {
    console.log(`Usage: node scripts/cleanupTestUsers.js [options]

Options:
  --drop-users                     Drop the users collection (DESCTRUCTIVE)
  --delete-domain=example.com      Delete users with emails ending with the domain
  --delete-unverified-days=7       Delete users who are unverified and created more than N days ago
  --delete-emails=a@x.com,b@y.com  Delete specific comma-separated emails
  --set-verified=a@x.com,b@y.com   Mark specific emails as verified
  --yes                            Actually perform destructive actions (required)
  --dry-run                        Show counts/what would happen (default)
  --help                           Show this help
`);
    await mongoose.disconnect();
    return;
  }

  // Drop users collection
  if (opts.drop) {
    if (!opts.yes) {
      console.log("Would drop 'users' collection. Re-run with --yes to execute.");
    } else {
      try {
        await mongoose.connection.db.dropCollection("users");
        console.log("Dropped 'users' collection.");
      } catch (err) {
        console.error("Drop failed:", err.message);
      }
    }
  }

  // Delete by domain
  if (opts.domain) {
    const regex = new RegExp(`@${opts.domain.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i");
    const count = await User.countDocuments({ email: { $regex: regex } });
    console.log(`Users matching domain ${opts.domain}: ${count}`);
    if (count > 0 && opts.yes) {
      const res = await User.deleteMany({ email: { $regex: regex } });
      console.log(`Deleted ${res.deletedCount} users`);
    }
  }

  // Delete unverified older than N days
  if (opts.unverifiedDays) {
    const cutoff = new Date(Date.now() - opts.unverifiedDays * 24 * 60 * 60 * 1000);
    const count = await User.countDocuments({ isVerified: false, createdAt: { $lt: cutoff } });
    console.log(`Unverified users older than ${opts.unverifiedDays} days: ${count}`);
    if (count > 0 && opts.yes) {
      const res = await User.deleteMany({ isVerified: false, createdAt: { $lt: cutoff } });
      console.log(`Deleted ${res.deletedCount} users`);
    }
  }

  // Delete specific emails
  if (opts.deleteEmails) {
    console.log(`Emails to delete: ${opts.deleteEmails.join(",")}`);
    if (opts.yes) {
      const res = await User.deleteMany({ email: { $in: opts.deleteEmails } });
      console.log(`Deleted ${res.deletedCount} users`);
    }
  }

  // Set specific emails as verified
  if (opts.setVerified) {
    console.log(`Emails to mark verified: ${opts.setVerified.join(",")}`);
    if (opts.yes) {
      const res = await User.updateMany({ email: { $in: opts.setVerified } }, { $set: { isVerified: true, verifyToken: null, verifyExpires: null } });
      console.log(`Updated ${res.modifiedCount} users`);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
