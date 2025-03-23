'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CreateJobPage() {
  const router = useRouter();
  const { user, userRole, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    salary_range: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to post a job');
      return;
    }
    
    if (userRole !== 'recruiter') {
      toast.error('Only recruiters can post jobs');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert requirements from textarea to array
      const requirementsArray = formData.requirements
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          company: formData.company,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          requirements: requirementsArray,
          salary_range: formData.salary_range,
          recruiter_id: user.id,
          status: 'active'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Job posted successfully!');
      router.push(`/dashboard/jobs/${data.id}`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user || userRole !== 'recruiter') {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Access Denied</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Only recruiters can post jobs.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Post a New Job</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tech Corp"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. New York, NY (or Remote)"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Job Type *</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $100,000"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="e.g. 3+ years of React experience&#10;Proficient in TypeScript&#10;Experience with CI/CD pipelines"
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add each requirement on a new line
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/dashboard/jobs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 