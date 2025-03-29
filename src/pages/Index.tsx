
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-10 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-[#FCBF49] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-bold rounded-lg transform -rotate-2">
                <span className="text-lg">Designed for neurodiverse minds</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Understand <span className="text-[#FF5A5F]">tone</span> and <span className="text-[#3A86FF]">sentiment</span> in text
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700">
                MoodScout helps you decode the emotional subtext in social media posts, emails, and messages.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white rounded-md px-6 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white text-black rounded-md px-6 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-[#3A86FF] rounded-lg border-4 border-black"></div>
                <div className="relative z-10 bg-white rounded-lg border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-md border-2 border-black">
                      <p className="text-lg">I'm not sure if my email sounds too demanding...</p>
                    </div>
                    <div className="bg-[#70E000]/20 p-4 rounded-md border-2 border-black">
                      <h3 className="font-bold">Analysis:</h3>
                      <p>Your message sounds <span className="font-bold text-[#3A86FF]">professional</span> with a <span className="font-bold text-[#70E000]">neutral tone</span>. Try adding "I appreciate your help" to soften it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-[#3A86FF]/10">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How MoodScout Helps You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-white border-4 border-black rounded-lg p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="bg-[#FCBF49] border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to understand text like never before?</h2>
              <p className="text-xl mb-8">MoodScout gives you the power to decode emotional subtext, making digital communication clearer and less stressful.</p>
              <Button
                className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white rounded-md px-8 py-6 text-xl font-bold border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition hover:-translate-y-1"
              >
                <Link to="/signup">Get Started For Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t-4 border-black">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-2xl font-bold">MoodScout</span>
              <span className="text-sm">© 2023</span>
            </div>
            
            <div className="flex gap-6">
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
