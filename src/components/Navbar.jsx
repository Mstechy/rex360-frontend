import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Removed Lock icon import
import logoImg from '../assets/logo.png'; // Keeps your logo

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Kept your specific background and text colors
    <nav className="fixed w-full z-50 bg-theme-white/95 backdrop-blur-md shadow-sm text-theme-blue font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={logoImg} alt="REX360 Solutions Logo" className="h-12 w-auto object-contain" />
          </Link>

          {/* DESKTOP MENU - No Lock Icon */}
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            <Link to="/" className="text-sm hover:text-theme-green transition-colors">Home</Link>
            <Link to="/services" className="text-sm hover:text-theme-green transition-colors">Services</Link>
            <Link to="/blog" className="text-sm hover:text-theme-green transition-colors">Blog</Link>
            
            {/* CTA Button */}
            <Link to="/services" className="bg-theme-green text-white px-6 py-3 font-bold rounded hover:bg-theme-greenDark transition-all shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-theme-blue hover:text-theme-green">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN - No Admin Link */}
      {isOpen && (
        <div className="md:hidden bg-theme-white shadow-lg border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-semibold text-theme-blue">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 text-base hover:text-theme-green"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 text-base hover:text-theme-green"
            >
              Services
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 text-base hover:text-theme-green"
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}