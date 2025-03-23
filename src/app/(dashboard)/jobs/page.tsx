'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  status: 'active' | 'closed';
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: '',
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newJob,
          requirements: newJob.requirements.split('\n').filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const job = await response.json();
      setJobs([...jobs, job]);
      setIsCreating(false);
      setNewJob({
        title: '',
        company: '',
        location: '',
        type: '',
        description: '',
        requirements: '',
      });
      toast.success('Job created successfully!');
    } catch (error) {
      toast.error('Failed to create job. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Jobs
        </h1>
        <Button
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          Create New Job
        </Button>
      </div>

      {/* Create Job Form */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Create New Job</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Type
              </label>
              <select
                id="type"
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Requirements (one per line)
              </label>
              <textarea
                id="requirements"
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Active Jobs
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.map((job) => (
              <li key={job.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {job.title}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span>{job.type}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {job.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
