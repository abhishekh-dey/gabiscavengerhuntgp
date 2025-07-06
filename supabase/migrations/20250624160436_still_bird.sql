/*
  # Add wrong attempts tracking table

  1. New Tables
    - `wrong_attempts`
      - `id` (uuid, primary key)
      - `unique_key` (text)
      - `attempted_at` (timestamp)

  2. Security
    - Enable RLS on wrong_attempts table
    - Add policies for public read/write access (for contest functionality)

  This table tracks keys that have been used for incorrect answers,
  preventing multiple wrong attempts per key while still allowing
  keys to be reused until someone completes the full process.
*/

-- Create wrong_attempts table to track incorrect riddle attempts
CREATE TABLE IF NOT EXISTS wrong_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_key text NOT NULL,
  attempted_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wrong_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for wrong_attempts table
CREATE POLICY "Anyone can read wrong attempts"
  ON wrong_attempts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert wrong attempts"
  ON wrong_attempts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can delete wrong attempts"
  ON wrong_attempts
  FOR DELETE
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_wrong_attempts_unique_key ON wrong_attempts(unique_key);