-- Insert test recruiter profile
INSERT INTO profiles (id, name, email, role, company, title, bio)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'John Recruiter',
  'john@example.com',
  'recruiter',
  'Tech Corp',
  'Senior Recruiter',
  'Experienced tech recruiter with 5+ years of experience'
);

-- Insert test employee profile
INSERT INTO profiles (id, name, email, role, skills, experience, education)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Jane Developer',
  'jane@example.com',
  'employee',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'],
  ARRAY['Senior Developer at Tech Corp (2020-2023)', 'Full Stack Developer at Web Solutions (2018-2020)'],
  ARRAY['BS Computer Science - University of Technology (2018)']
);

-- Insert test job
INSERT INTO jobs (
  id,
  recruiter_id,
  title,
  company,
  location,
  type,
  description,
  requirements,
  salary_range,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Senior Frontend Developer',
  'Tech Corp',
  'San Francisco, CA',
  'full-time',
  'We are looking for an experienced Frontend Developer to join our team. The ideal candidate will have strong experience with React and TypeScript.',
  ARRAY['5+ years of React experience', 'Strong TypeScript skills', 'Experience with modern build tools'],
  '$120,000 - $150,000',
  'active'
);

-- Insert test application
INSERT INTO applications (
  id,
  job_id,
  applicant_id,
  status,
  cover_letter
)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'pending',
  'I am excited to apply for the Senior Frontend Developer position at Tech Corp. With my experience in React and TypeScript, I believe I would be a great fit for your team.'
); 