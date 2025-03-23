-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('recruiter', 'employee')),
  skills TEXT[],
  experience TEXT[],
  education TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  description TEXT NOT NULL,
  requirements TEXT[],
  salary_range TEXT,
  status TEXT CHECK (status IN ('active', 'closed', 'draft')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, applicant_id)
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (status = 'active');

CREATE POLICY "Recruiters can view their own jobs"
  ON jobs FOR SELECT
  USING (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can update their own jobs"
  ON jobs FOR UPDATE
  USING (recruiter_id = auth.uid());

-- Applications policies
CREATE POLICY "Applicants can view their own applications"
  ON applications FOR SELECT
  USING (applicant_id = auth.uid());

CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can create applications"
  ON applications FOR INSERT
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Recruiters can update applications for their jobs"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.recruiter_id = auth.uid()
    )
  ); 