/*
  # GABI Scavenger Hunt Database Schema

  1. New Tables
    - `used_keys`
      - `id` (uuid, primary key)
      - `unique_key` (text, unique)
      - `used_at` (timestamp)
    - `winners`
      - `id` (uuid, primary key)
      - `name` (text)
      - `department` (text)
      - `unique_key` (text)
      - `riddle_index` (integer)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since this is a contest)
    - Add policies for public insert access (for contest participation)
*/

-- Create used_keys table to track which keys have been used
CREATE TABLE IF NOT EXISTS used_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_key text UNIQUE NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- Create winners table to store successful participants
CREATE TABLE IF NOT EXISTS winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  unique_key text NOT NULL,
  riddle_index integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE used_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Create policies for used_keys table
CREATE POLICY "Anyone can read used keys"
  ON used_keys
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert used keys"
  ON used_keys
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for winners table
CREATE POLICY "Anyone can read winners"
  ON winners
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert winners"
  ON winners
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_used_keys_unique_key ON used_keys(unique_key);
CREATE INDEX IF NOT EXISTS idx_winners_completed_at ON winners(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_winners_unique_key ON winners(unique_key);