import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/components/ui/NavHeader';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is logged in, redirect to analyzer
  useEffect(() => {
    if (user) {
      navigate('/analyzer');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#67168d] overflow-x-hidden">
      {/* Navigation */}
      <nav className="pt-8 pb-8">
        <NavHeader />
      </nav>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-6 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 space-y-8">
              <div className="inline-block px-5 py-3 bg-[#ffcf00] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-bold rounded-lg transform -rotate-2">
                <span className="text-lg">Designed for neurodiverse minds 🧠</span>
              </div>   
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">                
              <span className="text-[#3A86FF] font-bold">Decode Text</span> & <span className="text-[#f93d2b] font-bold">Reduce Anxiety</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[#ffffff]">
              MoodScout clarifies tone and emotions in your social media posts, emails and text messages so you can reply with confidence
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button
                  className="bg-[#f93d2b] hover:bg-[#f93d2b]/90 text-white rounded-md px-8 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white text-black rounded-md px-8 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-full h-full bg-[#3A86FF] rounded-lg border-4 border-black"></div>
                <div className="relative z-10 bg-white rounded-lg border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <img 
                    src="/hero-img.png" 
                    alt="MoodScout text analysis example" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-[#3A86FF]/10">
        <div className="container px-6 md:px-8 mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center text-white">How MoodScout Helps You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Decode Sentiment",
                description: "Understand the emotional tone behind messages and posts.",
                icon: "🔍"
              },
              {
                title: "Track Patterns",
                description: "Save analyses and identify communication patterns over time.",
                icon: "📊"
              },
              {
                title: "Get Suggestions",
                description: "Receive tips on how to adjust your text for better clarity.",
                icon: "💡"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-[#3A86FF] border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition duration-300"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="pricing" className="py-24">
        <div className="container px-6 md:px-8 mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Pricing</h2>
        <p className="text-xl mb-12 text-center text-white">Completely free while we're in beta!</p>
          <div className="bg-[#FCBF49] border-4 border-black rounded-lg p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Never worry about misreading the tone of written communication again</h2>
              <p className="text-xl mb-10">MoodScout decodes emotional subtext clearly and quickly, helping you communicate confidently and anxiety-free</p>
              <Button
                className="bg-[#f93d2b] hover:bg-[#FF5A5F]/100 text-white rounded-md px-10 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
              >
                <Link to="/signup">Claim Your Free Beta Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t-4 border-black">
        <div className="container px-6 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <span className="text-white text-2xl font-bold">MoodScout</span>
              <span className="text-sm">© 2025</span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-black hover:text-[#FF5A5F]">Privacy</a>
              <a href="#" className="text-black hover:text-[#FF5A5F]">Terms</a>
              <a href="#" className="text-black hover:text-[#FF5A5F]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
