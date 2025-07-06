/*
  # Add DELETE policies for purge functionality

  1. Security Updates
    - Add DELETE policies for both tables to allow purging
    - Maintain security while enabling the purge feature
*/

-- Add DELETE policy for used_keys table
CREATE POLICY "Anyone can delete used keys"
  ON used_keys
  FOR DELETE
  TO public
  USING (true);

-- Add DELETE policy for winners table  
CREATE POLICY "Anyone can delete winners"
  ON winners
  FOR DELETE
  TO public
  USING (true);