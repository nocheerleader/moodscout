import React from 'react';
import NavHeader from '@/components/ui/NavHeader';

const About = () => {
  return (
    <div className="min-h-screen bg-[#67168d] overflow-x-hidden">
      {/* Navigation */}
      <nav className="pt-6 pb-4 flex justify-center">
        <NavHeader />
      </nav>
      
      {/* Content */}
      <div className="container px-4 mx-auto py-16 text-center">
        <h1 className="text-5xl font-bold mb-8">About Us</h1>
        <p className="text-white text-xl mb-10">MoodScout was created by a neurodiverse mind for neurodiverse minds.<br /> <br /> Our mission is simple: help you communicate with clarity and confidence by taking <br />  the anxiety  out of digital interactions and decoding emotional subtext effortlessly.</p>
        
        {/* OpenGraph Image */}
        <div className="flex justify-center my-10">
          <img 
            src="/opengraph.png" 
            alt="MoodScout - Sentiment Analysis for Neurodiverse Minds" 
            className="rounded-lg max-w-full md:max-w-[500px] h-auto shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default About; 