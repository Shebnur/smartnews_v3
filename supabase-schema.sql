-- SmartNews v3 Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    "emailVerified" TIMESTAMP,
    image TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Account table (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE (provider, "providerAccountId")
);

-- Session table (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    "userId" TEXT,
    CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE (identifier, token)
);

-- UserProfile table
CREATE TABLE IF NOT EXISTS "UserProfile" (
    id TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL,
    bio TEXT,
    preferences TEXT,
    "notificationSettings" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- ChatArchive table
CREATE TABLE IF NOT EXISTS "ChatArchive" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT NOT NULL,
    messages TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ChatArchive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Research table
CREATE TABLE IF NOT EXISTS "Research" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT NOT NULL,
    query TEXT NOT NULL,
    results TEXT NOT NULL,
    "articlesCount" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Research_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Activity table
CREATE TABLE IF NOT EXISTS "Activity" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    "articleId" TEXT,
    "articleTitle" TEXT,
    category TEXT,
    "timeSpent" INTEGER DEFAULT 0 NOT NULL,
    metadata TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Activity_userId_createdAt_idx" ON "Activity"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Activity_userId_type_idx" ON "Activity"("userId", type);

-- SavedFilter table
CREATE TABLE IF NOT EXISTS "SavedFilter" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    name TEXT NOT NULL,
    "filterData" TEXT NOT NULL,
    "isDefault" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "SavedFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- SavedNews table
CREATE TABLE IF NOT EXISTS "SavedNews" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "articleUrl" TEXT,
    title TEXT NOT NULL,
    summary TEXT,
    category TEXT,
    source TEXT,
    "imageUrl" TEXT,
    "savedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT,
    tags TEXT,
    CONSTRAINT "SavedNews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE ("userId", "articleId")
);

CREATE INDEX IF NOT EXISTS "SavedNews_userId_savedAt_idx" ON "SavedNews"("userId", "savedAt");

-- Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    frequency TEXT DEFAULT 'daily' NOT NULL,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Subscription_userId_type_idx" ON "Subscription"("userId", type);

-- SearchHistory table (NEW)
CREATE TABLE IF NOT EXISTS "SearchHistory" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    query TEXT NOT NULL,
    "resultsCount" INTEGER DEFAULT 0 NOT NULL,
    filters TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "SearchHistory_userId_createdAt_idx" ON "SearchHistory"("userId", "createdAt");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updatedAt
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_userprofile_updated_at ON "UserProfile";
CREATE TRIGGER update_userprofile_updated_at BEFORE UPDATE ON "UserProfile" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chatarchive_updated_at ON "ChatArchive";
CREATE TRIGGER update_chatarchive_updated_at BEFORE UPDATE ON "ChatArchive" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_savedfilter_updated_at ON "SavedFilter";
CREATE TRIGGER update_savedfilter_updated_at BEFORE UPDATE ON "SavedFilter" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_updated_at ON "Subscription";
CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (Supabase handles this automatically)
-- All tables created successfully!
