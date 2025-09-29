-- Update existing base64 encoded answers to plain text
-- YWtpIG9sYQ== decodes to "aki ola"
-- YmFua3U= decodes to "banku"
UPDATE user_security_answers 
SET answer_hash = CASE 
  WHEN answer_hash = 'YWtpIG9sYQ==' THEN 'aki ola'
  WHEN answer_hash = 'YmFua3U=' THEN 'banku'
  ELSE answer_hash
END
WHERE user_id = '524d832e-fdce-41c4-8552-8d16fd61644d';