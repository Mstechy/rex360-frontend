import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, ShieldCheck, MapPin, Mail, 
  ArrowUpRight, Facebook, Twitter, Instagram, Linkedin 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-32 border-t border-white/5 relative overflow-hidden">
      {/* Cinematic Architectural Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 mb-24">
          
          {/* COLUMN 1: AGENCY IDENTITY & AUTHORITY */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-600/20">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter">REX360 <span className="text-emerald-500">SOLUTIONS</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-10 opacity-60 font-medium max-w-sm">
              Nigeria’s premier accredited agency for corporate formalization. We eliminate technical friction between entrepreneurs and the Corporate Affairs Commission.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-500">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: FILING NODES (DYNAMIC LINKS) */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 text-emerald-500">Filing Nodes</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/services?id=biz-name" className="hover:text-white flex items-center gap-2 group transition-all">Business Name <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/></Link></li>
              <li><Link to="/services?id=company" className="hover:text-white flex items-center gap-2 group transition-all">Private Limited <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/></Link></li>
              <li><Link to="/services?id=ngo" className="hover:text-white flex items-center gap-2 group transition-all">NGO / Church <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/></Link></li>
              <li><Link to="/services?id=trademark" className="hover:text-white flex items-center gap-2 group transition-all">Trademarks <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/></Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SYSTEM RESOURCES */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10">Resources</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/blog" className="hover:text-white transition-colors">Intelligence Hub</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Status</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Command Node</Link></li>
              <li><span className="cursor-pointer hover:text-white transition-colors italic opacity-50">Privacy Protocol</span></li>
            </ul>
          </div>

          {/* COLUMN 4: COMPLIANCE DESK (ACCESSION UNIT) */}
          <div className="lg:col-span-4 bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-10">Compliance Desk</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500"><ShieldCheck size={18}/></div>
                <div>
                  <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Accreditation ID</span>
                  <span className="text-white font-black text-sm tracking-tighter uppercase">RC 142280</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500"><Phone size={18}/></div>
                <span className="text-white font-black text-sm tracking-tighter uppercase">0904 834 9548</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500"><Mail size={18}/></div>
                <span className="text-white font-black text-[11px] tracking-widest uppercase truncate">rex360solutions@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: FINAL MEASURE & INFRASTRUCTURE STATUS */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              ©️ {currentYear} REX360 SOLUTIONS LTD. AUTHORIZED INCORPORATION BUREAU.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Infrastructure</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Audit Trail</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}