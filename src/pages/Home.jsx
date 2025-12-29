import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Reveal from '../components/Reveal';
import { 
  ArrowRight, CheckCircle2, ShieldCheck, Star, 
  Briefcase, Building2, Globe, Users, Stamp, Plane, Lock,
  FileBadge, Scale
} from 'lucide-react';

// --- THE FIX: We added '/api' to the link ---
const API_URL = "https://rex360backend.vercel.app/api";

const SERVICES = [
  { 
    id: 'biz-name', title: "Business Name Registration", price: "₦35,000", 
    desc: "Statutory registration for Sole Proprietorships & Ventures under Part B of CAMA 2020.", 
    icon: Briefcase, color: "text-blue-700", bg: "bg-blue-50" 
  },
  { 
    id: 'company', title: "Private Company (Ltd)", price: "₦80,000", 
    desc: "Incorporation of Private Companies Limited by Shares (LTD) with full legal personality.", 
    icon: Building2, color: "text-green-700", bg: "bg-green-50" 
  },
  { 
    id: 'ngo', title: "Incorporated Trustees", price: "₦140,000", 
    desc: "Registration for NGOs, Foundations, Churches, and Associations under Part F of CAMA.", 
    icon: Globe, color: "text-purple-700", bg: "bg-purple-50" 
  },
  { 
    id: 'partnership', title: "Partnership Registration", price: "₦35,000", 
    desc: "Formal registration of General or Limited Partnerships ensuring legal recognition.", 
    icon: Users, color: "text-indigo-700", bg: "bg-indigo-50" 
  },
  { 
    id: 'trademark', title: "Trademark & IP", price: "₦50,000", 
    desc: "Intellectual Property protection for logos, slogans, and brand assets.", 
    icon: Stamp, color: "text-orange-700", bg: "bg-orange-50" 
  },
  { 
    id: 'export', title: "Export License (NEPC)", price: "₦60,000", 
    desc: "Official Exporter's Certificate from the Nigerian Export Promotion Council.", 
    icon: Plane, color: "text-teal-700", bg: "bg-teal-50" 
  },
  { 
    id: 'copyright', title: "Copyright Services", price: "₦70,000", 
    desc: "Protection of creative works, literary content, and software under Nigerian Copyright Law.", 
    icon: Lock, color: "text-red-700", bg: "bg-red-50" 
  }
];

const DEFAULT_SLIDES = [{ id: 1, type: 'image', image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" }];

export default function Home() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [profile, setProfile] = useState(null);
  const [certs, setCerts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // This fetches from https://rex360backend.vercel.app/api/slides
    // The previous code was missing the '/api' part!
    fetch(`${API_URL}/slides`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (!data) return;
        const heroData = data.filter(item => item.section === 'hero');
        const profileData = data.find(item => item.section === 'profile');
        const certData = data.filter(item => item.section === 'certificate');

        if (heroData.length > 0) setSlides(heroData);
        if (profileData) setProfile(profileData);
        if (certData.length > 0) setCerts(certData);
      })
      .catch(err => console.error("Slider Fetch Error:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const floatAnim = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-green-100 selection:text-green-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#0a0a0a]">
        
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#0a0a0a]">
             {slides.map((slide, index) => (
               <div key={slide.id || index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                 {slide.type === 'video' ? (
                    <video src={slide.image_url} autoPlay muted loop playsInline className="w-full h-full object-contain"/>
                 ) : (
                    <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${slide.image_url})` }}/>
                 )}
                 <div className="absolute inset-0 bg-black/70"></div>
               </div>
             ))}
        </div>
        
        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-900/40 text-green-400 font-bold tracking-widest uppercase text-xs mb-6 backdrop-blur-md">
              <FileBadge size={14}/> Accredited CAC Agent
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-white mb-6 drop-shadow-2xl">
              Formalize Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Corporate Identity.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.4}>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-md">
              We provide seamless registration services strictly adhering to the 
              <span className="text-white font-medium"> Companies and Allied Matters Act (CAMA) 2020</span>.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="inline-flex bg-green-600 text-white px-8 py-4 font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition-all items-center gap-2">
                  Start Registration <ArrowRight size={20}/>
              </Link>
              <Link to="/blog" className="inline-flex border border-white/30 text-white px-8 py-4 font-bold text-lg rounded-lg hover:bg-white/10 transition-all items-center gap-2 backdrop-blur-sm">
                  View Regulations
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- TRUST SECTION --- */}
      <section className="bg-white dark:bg-slate-900 py-24 px-6 relative z-10 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
            <Reveal>
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="w-full lg:w-5/12 relative">
                        <div className="absolute top-10 left-10 w-full h-full bg-gray-100 dark:bg-slate-800 rounded-3xl -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-50 dark:bg-green-900/20 pattern-grid rounded-full z-0"></div>
                        <motion.div variants={floatAnim} animate="animate" className="relative z-10">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-b-4 border-green-600">
                                <img src={profile?.image_url || "https://via.placeholder.com/600x800?text=Consultant"} alt="Accredited Agent" className="w-full h-auto object-cover"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md p-6 text-white border-t border-white/10">
                                    <div className="flex items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-wider mb-1">
                                        <ShieldCheck size={14}/> Verified Personnel
                                    </div>
                                    <h3 className="text-xl font-serif font-bold">Lead Corporate Consultant</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-7/12">
                        <span className="text-green-700 font-bold uppercase tracking-widest text-sm mb-2 block">Regulatory Compliance</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                            Accredited by the <br/>Corporate Affairs Commission
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                            Operating under full licensure, REX360 SOLUTIONS ensures that your pre-incorporation and post-incorporation filings meet strict statutory requirements. 
                        </p>
                        
                        <div className="border-l-4 border-green-600 pl-6 mb-10">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2 mb-2">
                                <Scale size={20} className="text-green-600"/> Why Accreditation Matters
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400">
                                Only accredited agents have direct access to the CAC portal for priority filing, query resolution, and instant retrieval of certified true copies (CTC).
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-4">Official Certifications</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {certs.length > 0 ? certs.map((cert) => (
                                    <div key={cert.id} className="min-w-[120px] h-32 border border-gray-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition">
                                        <img src={cert.image_url} alt="License" className="w-full h-full object-contain"/>
                                    </div>
                                )) : (
                                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-slate-400 text-sm">
                                        Certificates Loading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 px-6 relative z-10 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
         <div className="max-w-7xl mx-auto">
             <Reveal>
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="text-green-700 font-bold uppercase text-xs tracking-widest">Our Practice Areas</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3 text-slate-900 dark:text-white">Statutory Registration Services</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">Select a service category to begin your compliant registration process.</p>
                </div>
             </Reveal>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {SERVICES.map((item, i) => (
                    <Reveal delay={0.1 * i} key={item.id}>
                        <Link to="/services" className="group block h-full">
                            <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-green-100 dark:hover:border-green-900 transition-all duration-300 flex flex-col relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 ${item.bg.replace('bg-', 'bg-gradient-to-r from-white to-')}`}></div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-12 h-12 ${item.bg} dark:bg-slate-800 ${item.color} flex items-center justify-center rounded-xl`}>
                                        <item.icon size={24}/>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">CAMA 2020</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed flex-grow">{item.desc}</p>
                                <div className="mt-auto border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase">Official Fee</p>
                                        <p className="text-lg font-bold text-green-700 dark:text-green-500">{item.price}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                                        <ArrowRight size={14}/>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Reveal>
                ))}
             </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-20 bg-slate-900 text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Ready to legitimize your business?</h2>
              <p className="text-slate-400 text-lg mb-8">
                  Don't risk penalties or loss of brand identity. Secure your registration with a verified accredited agent today.
              </p>
              <Link to="/services" className="inline-block bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-500 transition shadow-lg shadow-green-900/20">
                  Begin Registration Process
              </Link>
          </div>
      </section>
    </div>
  );
}