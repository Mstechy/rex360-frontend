import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, ShieldCheck, MapPin, Mail, 
  ArrowUpRight, Facebook, Twitter, Instagram, Linkedin 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-slate-400 py-24 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Architectural Background Element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* COLUMN 1: BRAND AUTHORITY (4 COLS) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-brand-accent p-2 rounded-xl text-brand-primary shadow-pro">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tightest">REX360</span>
            </div>
            <p className="text-sm leading-[1.8] mb-10 opacity-70 font-medium">
              Nigeria's premier portal for corporate formalization. As an accredited agent, we provide direct access to the Corporate Affairs Commission server for priority filing and express delivery.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-all duration-500">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: INTELLIGENCE LINKS (2 COLS) */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Solutions</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/services" className="hover:text-brand-accent flex items-center gap-2 group">Registration <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all"/></Link></li>
              <li><Link to="/services" className="hover:text-brand-accent flex items-center gap-2 group">NGOs/Charity <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all"/></Link></li>
              <li><Link to="/services" className="hover:text-brand-accent flex items-center gap-2 group">Trademarks <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all"/></Link></li>
            </ul>
          </div>

          {/* COLUMN 3: CORPORATE LINKS (2 COLS) */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Resources</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/blog" className="hover:text-brand-accent">Intelligence Hub</Link></li>
              <li><Link to="/login" className="hover:text-brand-accent">Command Node</Link></li>
              <li><span className="cursor-pointer hover:text-brand-accent">Privacy Protocol</span></li>
            </ul>
          </div>

          {/* COLUMN 4: VERIFICATION & CONTACT (4 COLS) */}
          <div className="lg:col-span-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8">Compliance Desk</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent"><ShieldCheck size={16}/></div>
                <div>
                  <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Accreditation ID</span>
                  <span className="text-white font-black text-sm tracking-tighter uppercase">RC 1422800582</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent"><Phone size={16}/></div>
                <span className="text-white font-black text-sm tracking-tighter uppercase">0904 834 9548</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-brand-accent/10 p-2 rounded-lg text-brand-accent"><MapPin size={16}/></div>
                <span className="text-white font-black text-sm tracking-tighter uppercase">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: THE FINAL MEASURE */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            © {currentYear} REX360 SOLUTIONS LTD. AUTHORIZED INCORPORATION BUREAU.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">Infrastructure</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}