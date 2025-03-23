'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Define interfaces
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary_range: string;
  created_at: string;
  status: string;
  recruiter_id: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  created_at: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userRole, loading } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const jobId = params?.id as string;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
          
        if (jobError) throw jobError;
        
        if (!jobData) {
          toast.error('Job not found');
          router.push('/dashboard/jobs');
          return;
        }
        
        setJob(jobData);
        setIsOwner(jobData.recruiter_id === user?.id);
        
        // If user is an employee, check if they've already applied
        if (user && userRole === 'employee') {
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobId)
            .eq('applicant_id', user.id)
            .maybeSingle();
            
          if (applicationError) throw applicationError;
          
          if (applicationData) {
            setApplication(applicationData);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchJobDetails();
    }
  }, [jobId, user, userRole, loading, router]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to apply for this job');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: 'pending',
          cover_letter: coverLetter
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      setApplication(data);
      setIsApplying(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Job Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold dark:text-white mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                    {job.type}
                  </span>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                    {job.status}
                  </span>
                  {job.salary_range && (
                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                      {job.salary_range}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                {userRole === 'employee' ? (
                  !application ? (
                    <Button 
                      onClick={() => setIsApplying(true)}
                      disabled={isApplying}
                      className="w-full md:w-auto"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Application Status</p>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                        application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  )
                ) : isOwner ? (
                  <Link href={`/dashboard/jobs/${job.id}/edit`}>
                    <Button variant="outline" className="w-full md:w-auto">
                      Edit Job
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="p-6">
            {isApplying ? (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell the recruiter why you're a good fit for this position..."
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 dark:text-white">Job Description</h2>
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 dark:text-white">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300">
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-semibold mb-3 dark:text-white">Additional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Posted On</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {new Date(job.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Employment Type</p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </p>
                    </div>
                    
                    {job.salary_range && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
                        <p className="text-gray-800 dark:text-gray-200">{job.salary_range}</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-800 dark:text-gray-200">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link href="/dashboard/jobs">
            <Button variant="outline">
              Back to Jobs
            </Button>
          </Link>
          
          {userRole === 'employee' && !isApplying && !application && (
            <Button onClick={() => setIsApplying(true)}>
              Apply for this Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 