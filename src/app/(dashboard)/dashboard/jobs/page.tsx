'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  status: 'active' | 'closed';
  created_at: string;
  salary_range?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'recruiter' | 'employee' | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get user session to determine user role
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (profile) {
            setUserRole(profile.role as 'recruiter' | 'employee');
          }
        }
        
        // Fetch active jobs
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      {userRole === 'recruiter' && (
        <div className="mb-6">
          <Link href="/dashboard/job/create">
            <Button>Post a New Job</Button>
          </Link>
        </div>
      )}
      
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No jobs available at the moment.</p>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    {job.salary_range && (
                      <p className="text-gray-500">Salary: {job.salary_range}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                      Posted on {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Link href={`/dashboard/job/${job.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 line-clamp-3">{job.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 