'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stats = [
  { name: 'Total Candidates', value: '0', href: '/dashboard/candidates' },
  { name: 'Active Jobs', value: '0', href: '/dashboard/jobs' },
  { name: 'Resumes Parsed', value: '0', href: '/dashboard/resume-parser' },
  { name: 'Matches Made', value: '0', href: '/dashboard/matching' },
];

const recentActivity = [
  {
    id: 1,
    type: 'resume_parsed',
    title: 'New Resume Parsed',
    description: 'John Doe\'s resume was successfully parsed',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'job_created',
    title: 'New Job Posted',
    description: 'Senior Software Engineer position added',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    type: 'match_made',
    title: 'New Match Found',
    description: 'Found 3 matching candidates for Frontend Developer',
    timestamp: '3 hours ago',
  },
];

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedTimeRange === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                  />
                </svg>
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
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
