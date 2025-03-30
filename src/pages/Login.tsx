
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/analyzer" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#67168d] flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="MoodScout Logo" className="h-16" />
      </Link>
      
      <div className="w-full max-w-md relative">
        <div className="absolute -top-3 -left-3 w-full h-full bg-[#3A86FF] rounded-lg border-4 border-black"></div>
        <div className="relative z-10 bg-white p-8 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-lg font-medium">Password</Label>
                <Link to="/forgot-password" className="text-sm text-[#FF5A5F] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="brutal-input text-lg py-3"
                placeholder="••••••••"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="brutal-button-primary w-full text-xl py-6"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
            
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#3A86FF] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        By logging in, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default Login;
