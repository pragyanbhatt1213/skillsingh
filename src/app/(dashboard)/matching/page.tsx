"use client";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface Match {
  id: string;
  candidateId: string;
  jobId: string;
  matchScore: number;
  candidate: {
    name: string;
    email: string;
    skills: string[];
  };
  job: {
    title: string;
    company: string;
    requirements: string[];
  };
}

export default function MatchingPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');

  const handleMatchCandidates = async () => {
    if (!selectedJob) {
      toast.error('Please select a job first');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/matching/${selectedJob}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to match candidates');
      }

      const data = await response.json();
      setMatches(data);
      toast.success('Candidates matched successfully!');
    } catch (error) {
      toast.error('Failed to match candidates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Candidate Matching
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a job</option>
            <option value="1">Senior Software Engineer</option>
            <option value="2">Frontend Developer</option>
            <option value="3">Backend Developer</option>
          </select>
          <Button
            onClick={handleMatchCandidates}
            disabled={isLoading || !selectedJob}
          >
            {isLoading ? 'Matching...' : 'Match Candidates'}
          </Button>
        </div>
      </div>

      {/* Matches List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Matched Candidates
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {matches.map((match) => (
              <li key={match.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {match.candidate.name}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{match.candidate.email}</span>
                      <span className="mx-2">•</span>
                      <span>{match.job.title}</span>
                      <span className="mx-2">•</span>
                      <span>{match.job.company}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        match.matchScore >= 80
                          ? 'bg-green-100 text-green-800'
                          : match.matchScore >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {match.matchScore}% Match
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {match.candidate.skills.map((skill) => (
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
                    Job Requirements
                  </h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                    {match.job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Contact Candidate
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
