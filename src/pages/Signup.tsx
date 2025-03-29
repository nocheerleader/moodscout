
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Navigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/analyzer" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
      // After signup, redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 text-3xl font-bold text-black hover:text-[#FF5A5F] transition-colors">
        MoodScout
      </Link>
      
      <div className="w-full max-w-md relative">
        <div className="absolute -top-3 -left-3 w-full h-full bg-[#FCBF49] rounded-lg border-4 border-black"></div>
        <div className="relative z-10 bg-white p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="brutal-input text-lg py-3"
                placeholder="Your Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="brutal-input text-lg py-3"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="brutal-input text-lg py-3"
                minLength={6}
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="brutal-button-secondary w-full text-xl py-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF5A5F] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        By signing up, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default Signup;
