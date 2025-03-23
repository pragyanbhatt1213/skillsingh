'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_range: string;
  status: 'active' | 'closed';
  created_at: string;
  recruiter_id: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'recruiter' | 'employee' | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!params.id) return;
        
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const currentUserId = session.user.id;
          setUserId(currentUserId);
          
          // Get user role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', currentUserId)
            .single();
            
          if (profile) {
            setUserRole(profile.role as 'recruiter' | 'employee');
          }
          
          // Check if user has already applied
          const { data: application } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', params.id)
            .eq('applicant_id', currentUserId)
            .maybeSingle();
            
          setHasApplied(!!application);
        }
        
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (jobError) {
          throw jobError;
        }
        
        setJob(jobData);
        
        // Check if user is the job owner
        if (session && jobData.recruiter_id === session.user.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [params.id]);

  const handleApply = async () => {
    if (!userId || !job) return;
    
    setIsApplying(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          applicant_id: userId,
          status: 'pending'
        });
        
      if (error) throw error;
      
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCloseJob = async () => {
    if (!job) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'closed' })
        .eq('id', job.id);
        
      if (error) throw error;
      
      setJob({ ...job, status: 'closed' });
      toast.success('Job closed successfully');
    } catch (error) {
      console.error('Error closing job:', error);
      toast.error('Failed to close job');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="mb-6">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
                {job.salary_range && (
                  <p className="text-gray-500">Salary: {job.salary_range}</p>
                )}
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold">Description</h3>
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
              
              {job.requirements && (
                <div>
                  <h3 className="text-md font-semibold">Requirements</h3>
                  <p className="whitespace-pre-line">{job.requirements}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                Posted on {new Date(job.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userRole === 'employee' ? (
                <>
                  {job.status === 'active' ? (
                    <>
                      {hasApplied ? (
                        <div className="bg-green-50 p-4 rounded-md">
                          <p className="text-green-800 font-semibold">You have already applied for this job.</p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={handleApply} 
                          disabled={isApplying}
                        >
                          {isApplying ? 'Applying...' : 'Apply Now'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-800">This job is no longer accepting applications.</p>
                    </div>
                  )}
                </>
              ) : isOwner ? (
                <div className="space-y-3">
                  <Link href={`/dashboard/applications?job=${job.id}`}>
                    <Button variant="outline" className="w-full">
                      View Applications
                    </Button>
                  </Link>
                  
                  {job.status === 'active' && (
                    <Button 
                      variant="outline" 
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      onClick={handleCloseJob}
                    >
                      Close Job
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-800">You must be an employee to apply for jobs.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 