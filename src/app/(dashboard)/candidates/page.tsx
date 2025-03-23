'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
  }[];
  status: 'active' | 'hired' | 'rejected';
  createdAt: string;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleStatusChange = async (candidateId: string, newStatus: Candidate['status']) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setCandidates(candidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, status: newStatus }
          : candidate
      ));
      toast.success('Candidate status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Candidates
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            All Candidates
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCandidates.map((candidate) => (
              <li key={candidate.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {candidate.name}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{candidate.email}</span>
                      <span className="mx-2">•</span>
                      <span>{candidate.phone}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        candidate.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : candidate.status === 'hired'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Experience
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {candidate.experience.map((exp, index) => (
                      <li key={index} className="text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-medium">{exp.position}</p>
                        <p>{exp.company} • {exp.duration}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(candidate.id, 'hired')}
                    disabled={isLoading || candidate.status === 'hired'}
                  >
                    Mark as Hired
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(candidate.id, 'rejected')}
                    disabled={isLoading || candidate.status === 'rejected'}
                  >
                    Reject
                  </Button>
                  <Button size="sm">
                    View Profile
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
