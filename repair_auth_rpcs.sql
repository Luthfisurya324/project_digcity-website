-- Drop existing functions if they exist to ensure clean creation
DROP FUNCTION IF EXISTS get_member_email_by_npm(text);
DROP FUNCTION IF EXISTS get_member_by_email(text);
DROP FUNCTION IF EXISTS get_member_by_npm(text);
DROP FUNCTION IF EXISTS update_member_email_if_empty(uuid, text);
DROP FUNCTION IF EXISTS update_member_email_if_empty(text, text); -- In case it was defined with text

-- Function to get member email by NPM
CREATE OR REPLACE FUNCTION get_member_email_by_npm(npm_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT email INTO found_email
  FROM organization_members
  WHERE npm = npm_input
  LIMIT 1;
  
  RETURN found_email;
END;
$$;

-- Function to get member details by Email
CREATE OR REPLACE FUNCTION get_member_by_email(email_input TEXT)
RETURNS SETOF organization_members
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM organization_members
  WHERE email = email_input
  LIMIT 1;
END;
$$;

-- Function to get member details by NPM
CREATE OR REPLACE FUNCTION get_member_by_npm(npm_input TEXT)
RETURNS SETOF organization_members
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM organization_members
  WHERE npm = npm_input
  LIMIT 1;
END;
$$;

-- Function to update member email if it is currently empty/null
-- Accepts UUID for member_id. If your ID column is TEXT, change UUID to TEXT below.
CREATE OR REPLACE FUNCTION update_member_email_if_empty(member_id UUID, new_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Only update if the current email is NULL or empty string
  UPDATE organization_members
  SET email = new_email, updated_at = NOW()
  WHERE id = member_id AND (email IS NULL OR email = '');
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows > 0;
END;
$$;

-- Grant execute permissions to authenticated and anon users (adjust as needed)
GRANT EXECUTE ON FUNCTION get_member_email_by_npm(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_member_by_email(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_member_by_npm(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_member_email_if_empty(uuid, text) TO anon, authenticated, service_role;
