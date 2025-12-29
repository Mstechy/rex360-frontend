import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
          <img src={logo} alt="REX360 Logo" className="h-10 w-auto mr-2" />
        </Link>

        {/* DESKTOP MENU (NO ADMIN LINK) */}
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

        {/* MOBILE MENU ICON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN (NO ADMIN LINK) */}
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
            
            <Link to="/services" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-4 shadow-md">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;