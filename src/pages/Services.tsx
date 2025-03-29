import React from 'react';
import NavHeader from '@/components/ui/NavHeader';

const Services = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      {/* Navigation */}
      <nav className="pt-6 pb-4 flex justify-center">
        <NavHeader />
      </nav>
      
      {/* Content */}
      <div className="container px-4 mx-auto py-16">
        <h1 className="text-5xl font-bold mb-8">Our Services</h1>
        <p className="text-xl">Explore the range of services we offer.</p>
      </div>
    </div>
  );
};

export default Services; 