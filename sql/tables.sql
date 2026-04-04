-- Supabase SQL Schema for GU Hackathon Project
-- This file contains the database schema for the social media content optimization platform

-- Enable Row Level Security (RLS) on all tables
-- Note: Supabase auth.users table is automatically created

-- Content Optimizations Table
CREATE TABLE IF NOT EXISTS content_optimizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  original_content TEXT,
  optimized_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform Analyses Table
CREATE TABLE IF NOT EXISTS platform_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  account_handle VARCHAR(255),
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trend Analyses Table
CREATE TABLE IF NOT EXISTS trend_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virality Predictions Table
CREATE TABLE IF NOT EXISTS virality_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  input_data JSONB,
  prediction_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Plans Table
CREATE TABLE IF NOT EXISTS content_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  platform VARCHAR(50) NOT NULL,
  plan_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts/Content Items Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(500),
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]',
  hashtags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, published, failed
  engagement_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE virality_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Content Optimizations
CREATE POLICY "Users can view their own content optimizations" ON content_optimizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content optimizations" ON content_optimizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content optimizations" ON content_optimizations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content optimizations" ON content_optimizations
  FOR DELETE USING (auth.uid() = user_id);

-- Platform Analyses
CREATE POLICY "Users can view their own platform analyses" ON platform_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform analyses" ON platform_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform analyses" ON platform_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform analyses" ON platform_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Trend Analyses
CREATE POLICY "Users can view their own trend analyses" ON trend_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trend analyses" ON trend_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trend analyses" ON trend_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trend analyses" ON trend_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Virality Predictions
CREATE POLICY "Users can view their own virality predictions" ON virality_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own virality predictions" ON virality_predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own virality predictions" ON virality_predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own virality predictions" ON virality_predictions
  FOR DELETE USING (auth.uid() = user_id);

-- Content Plans
CREATE POLICY "Users can view their own content plans" ON content_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content plans" ON content_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content plans" ON content_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content plans" ON content_plans
  FOR DELETE USING (auth.uid() = user_id);

-- User Profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts
CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_optimizations_user_id ON content_optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_optimizations_platform ON content_optimizations(platform);
CREATE INDEX IF NOT EXISTS idx_platform_analyses_user_id ON platform_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_analyses_platform ON platform_analyses(platform);
CREATE INDEX IF NOT EXISTS idx_trend_analyses_user_id ON trend_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_trend_analyses_platform ON trend_analyses(platform);
CREATE INDEX IF NOT EXISTS idx_virality_predictions_user_id ON virality_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_plans_user_id ON content_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_content_optimizations_updated_at BEFORE UPDATE ON content_optimizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_plans_updated_at BEFORE UPDATE ON content_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();