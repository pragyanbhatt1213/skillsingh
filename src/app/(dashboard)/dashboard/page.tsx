'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  status: 'active' | 'closed';
  created_at: string;
  recruiter_id: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  job: Job;
  profile?: Profile;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'recruiter' | 'employee';
  phone?: string;
  company?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'recruiter' | 'employee' | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('No session found');
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Failed to load profile information');
          return;
        }
        
        const role = profile?.role as 'recruiter' | 'employee';
        setUserRole(role);
        
        // Fetch data based on role
        if (role === 'recruiter') {
          await fetchRecruiterData(userId);
        } else {
          await fetchEmployeeData(userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const fetchRecruiterData = async (userId: string) => {
    try {
      // Fetch jobs posted by the recruiter
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', userId)
        .order('created_at', { ascending: false });
        
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return;
      }
      
      setJobs(jobsData || []);
      
      // Fetch applications for recruiter's jobs
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*),
          profile:profiles(*)
        `)
        .in('job_id', jobsData?.map(job => job.id) || [])
        .order('created_at', { ascending: false });
        
      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        return;
      }
      
      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error in recruiter data fetch:', error);
    }
  };
  
  const fetchEmployeeData = async (userId: string) => {
    try {
      // Fetch active jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return;
      }
      
      setJobs(jobsData || []);
      
      // Fetch employee's applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false });
        
      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        return;
      }
      
      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error in employee data fetch:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Recruiter Dashboard
  if (userRole === 'recruiter') {
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const recentApplications = applications.slice(0, 5);

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Link href="/dashboard/job/create">
            <Button>Post a New Job</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Jobs Fill Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.length ? Math.round((jobs.filter(job => job.status === 'closed').length / jobs.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent Applications</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{application.profile?.full_name || 'Applicant'}</h3>
                            <p className="text-sm text-gray-500">{application.job.title}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Link href={`/dashboard/application/${application.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No applications yet</p>
                )}
                {applications.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link href="/dashboard/applications">
                      <Button variant="outline">View All Applications</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Link href={`/dashboard/job/${job.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No jobs posted yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Employee Dashboard
  const activeApplications = applications.filter(app => app.status === 'pending' || app.status === 'reviewed').length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
  const availableJobs = jobs.length;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <Link href="/dashboard/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableJobs}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <p className="text-sm text-gray-500">{application.job.company} • {application.job.location}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Link href={`/dashboard/application/${application.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No applications yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Available Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Link href={`/dashboard/job/${job.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No jobs available</p>
              )}
              {jobs.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/jobs">
                    <Button variant="outline">View All Jobs</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 