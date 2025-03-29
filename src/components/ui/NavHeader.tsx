"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Define the position type
type PositionType = {
  left: number;
  width: number;
  opacity: number;
};

function NavHeader() {
  const [position, setPosition] = useState<PositionType>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <div className="relative flex items-center justify-between py-4">
        {/* Logo on the left, aligned with content */}
        <div className="z-10">
          <Link to="/">
            <img src="/logo.png" alt="MoodScout Logo" width={120} height={60} className="object-contain" />
          </Link>
        </div>
        
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex md:justify-center md:w-full md:absolute md:left-0">
          <ul
            className="relative flex w-fit rounded-full border-2 border-black bg-white p-1"
            onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
          >
            <Tab setPosition={setPosition} to="/">Home</Tab>
            <Tab setPosition={setPosition} to="/pricing">Pricing</Tab>
            <Tab setPosition={setPosition} to="/about">About</Tab>
            <Tab setPosition={setPosition} to="/login">Login</Tab>

            <Cursor position={position} />
          </ul>
        </div>

        {/* Mobile menu button - visible only on mobile */}
        <button 
          className="z-10 md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-8 h-8"
          >
            {mobileMenuOpen ? (
              // X icon when menu is open
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              // Hamburger icon when menu is closed
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - slides in from right */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src="/logo.png" alt="MoodScout Logo" width={100} height={50} className="object-contain" />
              </Link>
              <button 
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="w-8 h-8"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4">
              <ul className="flex flex-col space-y-6 text-xl">
                <MobileNavItem to="/" onClick={toggleMobileMenu}>Home</MobileNavItem>
                <MobileNavItem to="/pricing" onClick={toggleMobileMenu}>Pricing</MobileNavItem>
                <MobileNavItem to="/about" onClick={toggleMobileMenu}>About</MobileNavItem>
                <MobileNavItem to="/login" onClick={toggleMobileMenu}>Login</MobileNavItem>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MobileNavItem = ({
  children,
  to,
  onClick
}: {
  children: React.ReactNode;
  to: string;
  onClick: () => void;
}) => {
  return (
    <li className="border-b border-gray-200 pb-2">
      <Link 
        to={to} 
        className="block w-full font-medium"
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

const Tab = ({
  children,
  setPosition,
  to
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<PositionType>>;
  to: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      <Link to={to} className="block w-full h-full">
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: PositionType }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-pink-500 md:h-12"
    />
  );
};

export default NavHeader; 