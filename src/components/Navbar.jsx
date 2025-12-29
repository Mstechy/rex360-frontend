import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white mr-2 shadow-sm">
            R
          </div>
          <span>REX<span className="text-green-600">360</span></span>
        </Link>

        {/* DESKTOP MENU - No Admin/Lock Icon */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors text-sm uppercase tracking-wide">
            Home
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-green-600 font-medium transition-colors text-sm uppercase tracking-wide">
            Services
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-green-600 font-medium transition-colors text-sm uppercase tracking-wide">
            News
          </Link>
          
          <Link to="/services">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-sm">
              Get Started
            </button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl">
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium hover:text-green-600 text-lg">
              Home
            </Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium hover:text-green-600 text-lg">
              Services
            </Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium hover:text-green-600 text-lg">
              News
            </Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className="bg-green-600 text-white text-center py-3 rounded-xl font-bold mt-4 shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;