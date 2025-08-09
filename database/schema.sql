-- DIGCITY Website Database Schema
-- Run this script in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  registration_url TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'published', -- 'draft', 'published', 'archived'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'event', 'news', 'gallery'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, type) VALUES
  ('DIGIMON', 'Digital Monitoring - Program unggulan DIGCITY', 'event'),
  ('Level Up Day', 'Program pengembangan skill digital', 'event'),
  ('SCBD', 'Startup Community Business Development', 'event'),
  ('Workshop', 'Workshop dan pelatihan', 'event'),
  ('Seminar', 'Seminar dan webinar', 'event'),
  ('Pengumuman', 'Pengumuman resmi organisasi', 'news'),
  ('Artikel', 'Artikel dan blog post', 'news'),
  ('Berita', 'Berita terkini DIGCITY', 'news'),
  ('Kegiatan', 'Dokumentasi kegiatan', 'gallery'),
  ('Achievement', 'Pencapaian dan prestasi', 'gallery'),
  ('Behind The Scene', 'Dokumentasi di balik layar', 'gallery')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON gallery;
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Public can view news" ON news;
DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage news" ON news;
DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can view users" ON users;

-- Create RLS policies for public read access
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view news" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

-- Create RLS policies for authenticated users (admin)
CREATE POLICY "Authenticated users can manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view users" ON users FOR SELECT USING (auth.role() = 'authenticated');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample data for testing
INSERT INTO events (title, description, date, location, category) VALUES
  ('DIGIMON Workshop #1', 'Workshop Digital Monitoring untuk pemula', '2024-02-15 14:00:00+07', 'Lab Komputer Kampus', 'DIGIMON'),
  ('Level Up Day: Web Development', 'Pelatihan pengembangan web modern', '2024-02-20 09:00:00+07', 'Aula Utama', 'Level Up Day'),
  ('SCBD Networking Event', 'Event networking untuk startup community', '2024-02-25 16:00:00+07', 'Co-working Space', 'SCBD')
ON CONFLICT DO NOTHING;

INSERT INTO news (title, content, excerpt, author, published_date, category) VALUES
  ('Selamat Datang di Era Digital DIGCITY', 'DIGCITY hadir sebagai organisasi yang fokus pada pengembangan digital business...', 'DIGCITY memulai perjalanan baru dalam dunia digital business', 'Admin DIGCITY', '2024-01-15 10:00:00+07', 'Pengumuman'),
  ('Pendaftaran DIGIMON Batch 1 Dibuka', 'Program Digital Monitoring batch pertama telah dibuka untuk seluruh mahasiswa...', 'Kesempatan emas untuk belajar digital monitoring', 'Tim DIGIMON', '2024-01-20 14:00:00+07', 'Pengumuman')
ON CONFLICT DO NOTHING;

INSERT INTO gallery (title, description, image_url, category, event_date) VALUES
  ('DIGIMON Workshop Session 1', 'Dokumentasi workshop DIGIMON pertama', '/images/gallery/digimon-1.jpg', 'Kegiatan', '2024-01-10 14:00:00+07'),
  ('Level Up Day Opening', 'Pembukaan program Level Up Day', '/images/gallery/levelup-1.jpg', 'Kegiatan', '2024-01-12 09:00:00+07'),
  ('SCBD Community Gathering', 'Pertemuan komunitas startup pertama', '/images/gallery/scbd-1.jpg', 'Kegiatan', '2024-01-15 16:00:00+07')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_gallery_event_date ON gallery(event_date);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMIT;