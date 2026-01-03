import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Building2, Users, Landmark, Scale, 
  FileSignature, History, Briefcase, Stamp, Award, ShoppingCart, 
  Loader2, CheckCircle2, UserCheck, Globe, Zap, Fingerprint, Star
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Comprehensive Service Logic with Pro-Descriptions
  const cacServices = [
    { id: 1, title: "Business Name (BN)", price: 20000, icon: <Briefcase />, desc: "Registration of Enterprise/Sole Proprietorship. Ideal for startups and retail trade seeking legal recognition." },
    { id: 2, title: "Private Limited (LTD)", price: 55000, icon: <Building2 />, desc: "Full incorporation of a Limited Liability Company. Protects personal assets and allows share issuance." },
    { id: 3, title: "Inc. Trustees (NGO)", price: 150000, icon: <Landmark />, desc: "Establishment of Foundations, Churches, and Non-Profits. Legal backing for social impact initiatives." },
    { id: 4, title: "Company Secretarial", price: 35000, icon: <FileSignature />, desc: "Filing Statutory Returns and Shareholder updates to maintain 'Active' status on the CAC portal." },
    { id: 5, title: "SCUML & TIN Setup", price: 15000, icon: <ShieldCheck />, desc: "EFCC Anti-Money Laundering compliance and Tax Identification Number setup for corporate banking." },
    { id: 6, title: "Annual Returns", price: 10000, icon: <History />, desc: "Mandatory annual maintenance to avoid 'Inactive' status. Vital for government contracts and visas." },
    { id: 7, title: "Post-Incorp. Changes", price: 45000, icon: <Scale />, desc: "Legal modifications: Change of Directors, Business Address, or Nature of Business structures." }
  ];

  const handlePurchase = async (service) => {
    const email = prompt("Enter Official Email for CAC Filing Portal:");
    if (!email) return;
    setLoadingPayment(service.id);
    try {
      const res = await axios.post(`${API_URL}/payments/initialize`, {
        email, amount: service.price, serviceName: service.title
      });
      if (res.data?.authorization_url) window.location.href = res.data.authorization_url;
    } catch (err) { alert("Gateway Syncing... Retry."); }
    finally { setLoadingPayment(null); }
  };

  return (
    <div className="bg-[#fcfcfc] text-slate-900 selection:bg-green-600 selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-[100]" style={{ scaleX }} />

      {/* --- HERO: THE COMPLIANCE AUTHORITY --- */}
      <section className="relative min-h-screen flex items-center bg-slate-950 overflow-hidden pt-20">
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-2/3"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                <Fingerprint size={14} /> Official CAC Accredited Agent • RC 142280
              </div>
              <h1 className="text-6xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-10">
                Legal <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 italic font-light">Precision</span> <br /> Systems
              </h1>
              <div className="flex flex-wrap gap-6">
                <a href="#services" className="group px-12 py-7 bg-green-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white hover:text-slate-950 transition-all shadow-2xl shadow-green-600/20">
                   <span className="flex items-center gap-3">Initialize Registration <ArrowRight className="group-hover:translate-x-2 transition-transform"/></span>
                </a>
              </div>
            </motion.div>
            
            {/* Visual Anchor: The "Trusted Badge" */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="hidden lg:block w-1/3">
               <div className="relative">
                 <div className="w-80 h-80 border-2 border-green-500/30 rounded-[4rem] rotate-12 absolute inset-0" />
                 <div className="w-80 h-80 bg-slate-900 rounded-[4rem] -rotate-6 flex flex-col items-center justify-center p-10 border border-white/10 relative z-10">
                    <Stamp size={80} className="text-green-500 mb-6" />
                    <p className="text-white font-black text-center uppercase tracking-tighter text-2xl">Verified <br /> Compliance</p>
                    <div className="mt-6 flex gap-1 text-green-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- THE ABOUT ME: IDENTITY OF THE AGENT --- */}
      <section className="py-40 bg-white" id="about">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="w-full lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-slate-100 shadow-3xl">
                <img src="https://images.unsplash.com/photo-1556157382-97dee2dcb34e?q=80&w=1000" alt="Lead Agent" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-green-600 p-10 rounded-[3rem] shadow-2xl text-white">
                <UserCheck size={48} />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-green-600 font-black text-xs uppercase tracking-[0.6em] mb-6 block">Accredited Professional Identity</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter mb-10 leading-none">Your Direct <br /> <span className="text-slate-300">Portal Bridge</span></h2>
              <div className="space-y-6 text-slate-500 font-medium text-lg leading-relaxed">
                <p>As a seasoned CAC Accredited Agent, I provide a high-tier interface for corporate filings. REX360 Solutions was built to eliminate the technical friction between Nigerian entrepreneurs and the Corporate Affairs Commission.</p>
                <p>We handle the heavy lifting—Constitutions, Article of Association, and Shareholder Agreements—ensuring your entity is birthed on a solid legal foundation. Direct API access means your filings move faster than the standard queue.</p>
              </div>
              <div className="mt-12 flex gap-12">
                 <div><p className="text-4xl font-black text-slate-900">24Hr</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fastest Turnaround</p></div>
                 <div><p className="text-4xl font-black text-slate-900">100%</p><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Legal Integrity</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES: THE DENSE 7-GRID --- */}
      <section className="py-40 bg-slate-50" id="services">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mb-32">
            <h2 className="text-6xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-8 italic">Strategic <br /> <span className="font-light text-slate-400 not-italic">Compliance</span></h2>
            <div className="h-2 w-40 bg-green-600 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cacServices.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -15 }}
                className="group bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-green-600/30 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 mb-10 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-6">{service.title}</h3>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed mb-12 h-20 line-clamp-3 italic">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-slate-950 tracking-tighter italic">₦{service.price.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Authorized Rate</span>
                  </div>
                  <button 
                    onClick={() => handlePurchase(service)}
                    className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition-all group-hover:rotate-[360deg] duration-700"
                  >
                    {loadingPayment === service.id ? <Loader2 className="animate-spin" /> : <ShoppingCart size={22} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST VAULT: CERTIFICATES & COMPLIANCE --- */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-[6rem] font-black text-slate-950 uppercase tracking-tighter mb-4">The Trust Vault</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Accreditation & Regulatory Verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "CAC Accreditation", ref: "AGENT-001", icon: <Award className="text-green-600"/> },
              { title: "Legal Status Report", ref: "STATUS-ACTIVE", icon: <CheckCircle2 className="text-blue-600"/> },
              { title: "Agent RC License", ref: "RC-142280", icon: <Landmark className="text-violet-600"/> },
            ].map((cert, i) => (
              <div key={i} className="group relative p-10 bg-slate-950 rounded-[3rem] border border-white/5 overflow-hidden">
                 <div className="relative z-10">
                    <div className="mb-6">{cert.icon}</div>
                    <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">{cert.title}</h4>
                    <p className="text-green-500 font-mono text-xs">{cert.ref}</p>
                    <button className="mt-8 px-6 py-3 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-green-600 transition-all">View Proof</button>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 blur-[60px] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA: FINAL SCALE --- */}
      <section className="py-40 bg-slate-950 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
        <div className="container mx-auto px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-[8rem] font-black text-white uppercase tracking-tighter mb-16 leading-none">Launch Your <br /> <span className="text-green-500 italic">Enterprise</span></h2>
          <button className="px-20 py-10 bg-green-600 text-white font-black uppercase tracking-[0.5em] text-xs rounded-full hover:scale-105 transition-transform shadow-2xl shadow-green-600/40">
            Access Registration Portal
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;