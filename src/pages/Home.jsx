import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Building2, Landmark, 
  FileSignature, History, Briefcase, Stamp, Award, ShoppingCart, 
  Loader2, CheckCircle2, UserCheck, Star, Fingerprint, Zap
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [loadingPayment, setLoadingPayment] = useState(null);

  const cacServices = [
    { id: 1, title: "Business Name (BN)", price: 20000, icon: <Briefcase size={24}/>, desc: "Registration of Enterprise/Sole Proprietorship. Ideal for startups." },
    { id: 2, title: "Private Limited (LTD)", price: 55000, icon: <Building2 size={24}/>, desc: "Full incorporation of a Limited Liability Company. Protects personal assets." },
    { id: 3, title: "Inc. Trustees (NGO)", price: 150000, icon: <Landmark size={24}/>, desc: "Foundations, Churches, and Non-Profits legal backing." },
    { id: 4, title: "Company Secretarial", price: 35000, icon: <FileSignature size={24}/>, desc: "Statutory filing and shareholder updates for compliance." },
    { id: 5, title: "SCUML & TIN Setup", price: 15000, icon: <ShieldCheck size={24}/>, desc: "EFCC compliance and Tax ID setup for corporate banking." },
    { id: 6, title: "Annual Returns", price: 10000, icon: <History size={24}/>, desc: "Mandatory annual maintenance to avoid 'Inactive' status." },
    { id: 7, title: "Post-Incorp. Changes", price: 45000, icon: <Fingerprint size={24}/>, desc: "Change of Directors, Address, or Nature of Business structures." }
  ];

  const handlePurchase = async (service) => {
    const email = prompt("Enter Official Email for CAC Filing:");
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
    <div className="bg-white text-slate-900 selection:bg-green-600 selection:text-white">
      
      {/* --- HERO SECTION: BALANCED & PROFESSIONAL --- */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 bg-slate-950 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge-text mb-6 inline-block">
                <Zap size={14} className="inline mr-2 text-green-500" />
                Official CAC Accredited Agent • RC 142280
              </span>
              
              <h1 className="text-white mb-8">
                Legal Precision <br />
                <span className="text-green-500 italic">Systems.</span>
              </h1>
              
              <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
                As a seasoned CAC Accredited Agent, I provide a high-tier interface for corporate filings. 
                Eliminate technical friction and birth your entity on a solid legal foundation.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="#services" className="btn-elite bg-green-600 hover:bg-green-500 text-white">
                  Initialize Registration
                </a>
                <a href="#about" className="px-8 py-3 font-bold text-white border border-white/20 rounded-lg hover:bg-white/5 transition-all">
                  Meet the Agent
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION: TRUST & ACCREDITATION --- */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000" 
                  alt="Corporate Office" 
                  className="w-full h-full object-cover grayscale" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-green-600 p-6 rounded-2xl shadow-xl">
                <UserCheck size={32} className="text-white" />
              </div>
            </div>
            
            <div>
              <span className="text-green-600 font-bold text-xs uppercase tracking-widest mb-4 block">Professional Bridge</span>
              <h2 className="mb-8">Strategic <br/><span className="text-slate-400">Compliance</span></h2>
              <div className="space-y-6 text-slate-600 text-lg">
                <p>REX360 Solutions handles the heavy lifting—Constitutions, Article of Association, and Shareholder Agreements—ensuring your entity is compliant from day one.</p>
                <p>Direct API access means your filings move faster than the standard queue, backed by 100% legal integrity.</p>
              </div>
              <div className="mt-10 flex gap-10">
                <div>
                  <p className="text-3xl font-black text-slate-900">24Hr</p>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Turnaround</p>
                </div>
                <div className="h-12 w-px bg-slate-200" />
                <div>
                  <p className="text-3xl font-black text-slate-900">5k+</p>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Filings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES: CLEAN 7-GRID --- */}
      <section className="py-24 bg-slate-50" id="services">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="mb-4">Authorized <span className="text-green-600">Services</span></h2>
            <div className="w-20 h-1.5 bg-green-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cacServices.map((service) => (
              <motion.div key={service.id} whileHover={{ y: -5 }} className="card-elite flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="mb-4 text-lg">{service.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">₦{service.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Official Fee</span>
                  </div>
                  <button
                    onClick={() => handlePurchase(service)}
                    className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-green-600 transition-all shadow-lg"
                  >
                    {loadingPayment === service.id ? <Loader2 className="animate-spin" size={20}/> : <ShoppingCart size={20} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST VAULT --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Accreditation", ref: "AGENT-142280", icon: <Award className="text-green-600"/> },
              { title: "Compliance", ref: "STATUS-ACTIVE", icon: <CheckCircle2 className="text-green-600"/> },
              { title: "Identity", ref: "VERIFIED-PRO", icon: <Fingerprint className="text-green-600"/> },
            ].map((cert, i) => (
              <div key={i} className="flex items-center gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="shrink-0">{cert.icon}</div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{cert.title}</h4>
                  <p className="text-xs font-mono font-bold text-slate-400 mt-1">{cert.ref}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-white mb-10 text-4xl md:text-5xl">Launch Your <br/><span className="text-green-500 italic">Enterprise Today.</span></h2>
          <button className="btn-elite bg-green-600 hover:bg-green-500 text-white shadow-green-600/20">
            Access Registration Portal
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;