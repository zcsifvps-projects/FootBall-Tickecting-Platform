const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const readline = require('readline');

// Load .env from repo root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../models/User');
const Ticket = require('../models/Ticket');

function parseArg(name) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}`));
  if (!arg) return null;
  const parts = arg.split('=');
  return parts.length > 1 ? parts.slice(1).join('=') : true;
}

async function confirmPrompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer));
    });
  });
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env (backend-faz-ticket/.env)');
    process.exit(1);
  }

  // CLI flags
  const doUsers = !!parseArg('users') || !!parseArg('all');
  const doTickets = !!parseArg('tickets') || !!parseArg('all');
  const onlyUnverified = !!parseArg('unverified');
  const preserveAdmins = !!parseArg('preserve-admins');
  const domain = parseArg('domain'); // e.g. --domain=example.com
  const yes = !!parseArg('yes');
  const dryRun = !!parseArg('dry-run');

  if (!doUsers && !doTickets) {
    console.log('Usage: node scripts/cleanDb.cjs [--users] [--tickets] [--all] [--unverified] [--preserve-admins] [--domain=example.com] [--dry-run] [--yes]');
    console.log('Example: node scripts/cleanDb.cjs --users --unverified --preserve-admins');
    process.exit(0);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Build user filter
    let userFilter = {};
    if (onlyUnverified) userFilter.isVerified = false;
    if (domain) userFilter.email = { $regex: `@${domain.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&')}$`, $options: 'i' };

    if (doUsers) {
      // If preserveAdmins, ensure admins are excluded
      if (preserveAdmins) userFilter = { ...userFilter, isAdmin: { $ne: true } };

      const usersCol = mongoose.connection.db.collection('users');
      const userCount = await usersCol.countDocuments(userFilter);
      console.log(`Users matched: ${userCount}`);

      if (dryRun) {
        console.log('Dry run enabled - no users will be deleted');
      } else {
        if (!yes) {
          const ok = await confirmPrompt(`Delete ${userCount} users matching filter? (yes/no) `);
          if (!ok) {
            console.log('Aborting users delete');
          } else {
            const res = await usersCol.deleteMany(userFilter);
            console.log(`✅ Deleted ${res.deletedCount || 0} users`);
          }
        } else {
          const res = await usersCol.deleteMany(userFilter);
          console.log(`✅ Deleted ${res.deletedCount || 0} users`);
        }
      }
    }

    if (doTickets) {
      const ticketsCol = mongoose.connection.db.collection('tickets');
      const ticketCount = await ticketsCol.countDocuments({});
      console.log(`Tickets matched: ${ticketCount}`);
      if (dryRun) {
        console.log('Dry run enabled - no tickets will be deleted');
      } else {
        if (!yes) {
          const ok = await confirmPrompt(`Delete ${ticketCount} tickets? (yes/no) `);
          if (!ok) {
            console.log('Aborting tickets delete');
          } else {
            const tres = await ticketsCol.deleteMany({});
            console.log(`✅ Deleted ${tres.deletedCount || 0} tickets`);
          }
        } else {
          const tres = await ticketsCol.deleteMany({});
          console.log(`✅ Deleted ${tres.deletedCount || 0} tickets`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('✅ Database cleanup finished');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
}

run();
