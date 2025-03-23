import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Transform Your Hiring Process
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              AI-powered resume parsing and skill matching platform
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Smart Resume Parsing</h3>
              <p className="text-gray-600">Extract structured data from resumes in multiple formats using advanced AI</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Skill Matching</h3>
              <p className="text-gray-600">Match candidate skills with job requirements using ML algorithms</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Multilingual Support</h3>
              <p className="text-gray-600">Process resumes in multiple languages with advanced NLP</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of companies using SkillSingh to streamline their recruitment process
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}