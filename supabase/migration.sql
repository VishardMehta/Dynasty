-- =============================================
-- Dynasty — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Marina Bay Tower — Phase 2',
  location TEXT DEFAULT 'Singapore',
  contractor TEXT DEFAULT 'BuildCorp International',
  start_date TEXT DEFAULT '2025-09-15',
  estimated_end TEXT DEFAULT '2027-03-30',
  current_floor INTEGER DEFAULT 14,
  total_floors INTEGER DEFAULT 28,
  completion_percent INTEGER DEFAULT 42,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded components (from BIM/CSV)
CREATE TABLE IF NOT EXISTS components (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  dims TEXT,
  length_m REAL DEFAULT 0,
  width_m REAL DEFAULT 0,
  height_m REAL DEFAULT 0,
  qty INTEGER DEFAULT 1,
  area REAL DEFAULT 0,
  weight_kg REAL DEFAULT 0,
  floor_start INTEGER DEFAULT 1,
  floor_end INTEGER DEFAULT 1,
  material TEXT,
  confidence REAL DEFAULT 95,
  status TEXT DEFAULT 'Review',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated kits
CREATE TABLE IF NOT EXISTS kits (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  schedule TEXT,
  status TEXT DEFAULT 'Pending',
  items JSONB DEFAULT '[]',
  total_weight TEXT,
  total_weight_num REAL DEFAULT 0,
  utilization INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BoQ items
CREATE TABLE IF NOT EXISTS boq_items (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  unit TEXT DEFAULT 'm²',
  ai_qty REAL DEFAULT 0,
  manual_qty REAL DEFAULT 0,
  rate REAL DEFAULT 0,
  variance REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'cyan',
  text TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upload sessions (track each upload)
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT,
  file_size TEXT,
  component_count INTEGER DEFAULT 0,
  total_qty INTEGER DEFAULT 0,
  process_time TEXT,
  avg_confidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for prototype (no auth)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (prototype only — no auth)
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on components" ON components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on kits" ON kits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on boq_items" ON boq_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on activity_log" ON activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on uploads" ON uploads FOR ALL USING (true) WITH CHECK (true);

-- Insert default project
INSERT INTO projects (name, location, contractor, start_date, estimated_end, current_floor, total_floors, completion_percent)
VALUES ('Marina Bay Tower — Phase 2', 'Singapore', 'BuildCorp International', '2025-09-15', '2027-03-30', 14, 28, 42);
