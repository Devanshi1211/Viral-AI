/*
  Revised login page with premium UI.
  Preserves existing authentication logic and imports.
*/
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Simple mount animation flag
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#050507] text-white overflow-hidden">
      {/* Left side – hidden on small screens */}
      <div className="hidden md:flex w-1/2 flex-col justify-center p-12 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-500/15 to-cyan-400/10 pointer-events-none" />
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-[#7C3AED]" />
            <h1 className="text-3xl font-bold">ViralAI</h1>
          </div>
          <p className="text-sm text-[#9CA3AF]">AI Content Intelligence</p>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
            Turn content ideas into viral growth.
          </h2>
          <p className="mt-4 text-lg text-[#9CA3AF]">
            Predict content performance, discover trends, and create smarter social media strategies with AI.
          </p>
          {/* Feature cards */}
          <div className="grid gap-4 mt-6 md:grid-cols-1">
            <div className="flex items-start space-x-3 p-4 bg-[#0D0D14] rounded-lg border border-white/5">
              <Sparkles className="h-6 w-6 text-[#7C3AED] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">AI Virality Prediction</h3>
                <p className="text-sm text-[#9CA3AF]">Predict your content's potential before publishing.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-[#0D0D14] rounded-lg border border-white/5">
              <TrendingUp className="h-6 w-6 text-[#2563EB] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">Trend Intelligence</h3>
                <p className="text-sm text-[#9CA3AF]">Discover emerging trends and content opportunities.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-[#0D0D14] rounded-lg border border-white/5">
              <BarChart3 className="h-6 w-6 text-[#06B6D4] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">Smart Recommendations</h3>
                <p className="text-sm text-[#9CA3AF]">Get actionable recommendations to improve your content.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side – login form */}
      <div className="flex flex-1 items-center justify-center p-4">
        <Card
          className={`w-full max-w-md bg-[#0D0D14] bg-opacity-80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <CardHeader className="space-y-1 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-[#7C3AED]" />
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-[#9CA3AF]">
              Sign in to continue to your ViralAI workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#9CA3AF]">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-gray-700 bg-[#121212] text-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0M12 14v6m0-6a4 4 0 100-8 4 4 0 000 8z" /></svg>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#9CA3AF]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-gray-700 bg-[#121212] text-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v4h-6v-4z" /></svg>
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white hover:from-[#8B5CF6] hover:to-[#3B82F6] transition-all duration-200 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-[#9CA3AF]">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#7C3AED] hover:underline">
                Sign up
              </Link>
            </div>
            <p className="mt-6 text-center text-xs text-[#9CA3AF]">
              Secure access · AI-powered content intelligence
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}