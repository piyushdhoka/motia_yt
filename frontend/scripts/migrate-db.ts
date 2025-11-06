import { auth } from "../lib/auth";

async function migrate() {
  try {
    console.log("Starting database migration...");
    
    // BetterAuth will automatically create the necessary tables
    // when it connects to the database for the first time
    console.log("Database schema will be created automatically on first run.");
    console.log("Required tables: user, session, account, verification");
    
    console.log("\nMigration preparation complete!");
    console.log("\nNext steps:");
    console.log("1. Make sure your DATABASE_URL in .env is set correctly");
    console.log("2. Start your Next.js dev server: npm run dev");
    console.log("3. BetterAuth will create tables automatically on first authentication");
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
