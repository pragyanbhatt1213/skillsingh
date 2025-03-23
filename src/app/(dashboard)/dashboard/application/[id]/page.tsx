'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  status: 'active' | 'closed';
  created_at: string;
  recruiter_id: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  job?: Job;
  profile?: Profile;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        if (!params.id) return;
        
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        const currentUserId = session.user.id;
        
        // Get user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', currentUserId)
          .single();
          
        if (profile && profile.role === 'recruiter') {
          setIsRecruiter(true);
        }
        
        // Fetch application details
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            job:jobs(*),
            profile:profiles(*)
          `)
          .eq('id', params.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setApplication(data);
        
        // Check if current user is the applicant or the job poster
        if (data.applicant_id === currentUserId || (data.job && data.job.recruiter_id === currentUserId)) {
          setIsOwner(true);
        } else {
          // If not owner, redirect to dashboard
          toast.error('You do not have permission to view this application');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        toast.error('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationDetails();
  }, [params.id, router]);

  const updateApplicationStatus = async (status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    if (!application) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', application.id);
        
      if (error) throw error;
      
      setApplication({
        ...application,
        status
      });
      
      toast.success(`Application marked as ${status}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!application || !isOwner) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
          <p className="mb-6">The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const jobStatus = application.job?.status || 'unknown';
  const jobStatusCapitalized = jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/job/${application.job_id}`}>
            <Button variant="outline">View Job</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{application.job?.title}</h3>
                <p className="text-gray-500">{application.job?.company} • {application.job?.location}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    jobStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {jobStatusCapitalized}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold">Description</h3>
                <p className="whitespace-pre-line">{application.job?.description}</p>
              </div>
              
              <div className="text-sm text-gray-500">
                Job posted on {new Date(application.job?.created_at || '').toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          
          {isRecruiter && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{application.profile?.full_name}</h3>
                  <p className="text-gray-500">{application.profile?.email}</p>
                  {application.profile?.phone && (
                    <p className="text-gray-500">{application.profile.phone}</p>
                  )}
                </div>
                
                {application.profile?.title && (
                  <div>
                    <h3 className="text-md font-semibold">Title</h3>
                    <p>{application.profile.title}</p>
                  </div>
                )}
                
                {application.profile?.bio && (
                  <div>
                    <h3 className="text-md font-semibold">Bio</h3>
                    <p className="whitespace-pre-line">{application.profile.bio}</p>
                  </div>
                )}
                
                {application.profile?.skills && application.profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {application.profile?.experience && (
                  <div>
                    <h3 className="text-md font-semibold">Experience</h3>
                    <p className="whitespace-pre-line">{application.profile.experience}</p>
                  </div>
                )}
                
                {application.profile?.education && (
                  <div>
                    <h3 className="text-md font-semibold">Education</h3>
                    <p className="whitespace-pre-line">{application.profile.education}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                
                <p className="mt-2 text-sm text-gray-500">
                  Applied on {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
              
              {isRecruiter && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Update Status</h3>
                  <Button 
                    className="w-full mb-2"
                    variant={application.status === 'reviewed' ? 'default' : 'outline'}
                    onClick={() => updateApplicationStatus('reviewed')}
                    disabled={isUpdating || application.status === 'reviewed'}
                  >
                    Mark as Reviewed
                  </Button>
                  <Button 
                    className="w-full mb-2 bg-green-600 hover:bg-green-700"
                    onClick={() => updateApplicationStatus('accepted')}
                    disabled={isUpdating || application.status === 'accepted'}
                  >
                    Accept Application
                  </Button>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => updateApplicationStatus('rejected')}
                    disabled={isUpdating || application.status === 'rejected'}
                  >
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 