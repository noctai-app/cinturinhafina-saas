/*
  # Fix RLS policies for user_submissions table

  1. Security Updates
    - Update INSERT policy to allow anonymous users to insert data
    - Ensure SELECT policy allows authenticated users to read data
    - Add UPDATE policy for tracking user actions

  This migration fixes the "new row violates row-level security policy" error
  by properly configuring RLS policies for the user_submissions table.
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Permitir inserção pública de submissões" ON user_submissions;
DROP POLICY IF EXISTS "Admins podem ler todas as submissões" ON user_submissions;
DROP POLICY IF EXISTS "Permitir atualização pública de ações" ON user_submissions;

-- Create new policies with correct permissions
CREATE POLICY "Allow anonymous insert on user_submissions"
  ON user_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on user_submissions"
  ON user_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous update for tracking actions"
  ON user_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;