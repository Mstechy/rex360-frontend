import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
              <h3 className="text-2xl font-bold text-white mb-4">REX360 SOLUTIONS</h3>
              <p className="text-sm leading-relaxed mb-6 opacity-80">
                  The most trusted name in CAC Registration. We eliminate the stress of bureaucracy so you can focus on your business.
              </p>
          </div>

          {/* Links */}
          <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                  <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
                  <li><Link to="/services" className="hover:text-green-400 transition">Start Registration</Link></li>
                  <li><Link to="/blog" className="hover:text-green-400 transition">Latest News</Link></li>
              </ul>
          </div>

          {/* Legal */}
          <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                  <li><span className="cursor-pointer hover:text-green-400">Privacy Policy</span></li>
                  <li><span className="cursor-pointer hover:text-green-400">Terms of Service</span></li>
              </ul>
          </div>

          {/* Contact */}
          <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                      <ShieldCheck size={16} className="text-green-500 mt-1"/>
                      <span>Accredited Code:<br/><strong className="text-white">1422800582</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                      <Phone size={16} className="text-green-500"/>
                      <span>09048349548</span>
                  </li>
                  <li className="flex items-center gap-3">
                      <MapPin size={16} className="text-green-500"/>
                      <span>Lagos, Nigeria</span>
                  </li>
              </ul>
          </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center text-xs opacity-60">
          <p>© 2025 REX360 Solutions. All Rights Reserved.</p>
      </div>
    </footer>
  );
}