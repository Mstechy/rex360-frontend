import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Building2, Landmark, 
  FileSignature, History, Briefcase, Stamp, 
  Zap, Newspaper, ArrowUpRight, CheckCircle2,
  ChevronDown, Award, Scale, Globe, UserCheck
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

// Kinetic Counter for the 24h and 100% stats
const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const handle = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(handle); }
      else { setCount(Math.floor(start)); }
    }, 1000 / 60);
    return () => clearInterval(handle);
  }, [end]);
  return <span>{count}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cacServices, setCacServices] = useState([]);
  const [credentials, setCredentials] = useState([]); 
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchBureauData = async () => {
      try {
        const [sliRes, srvRes, crdRes] = await Promise.allSettled([
          axios.get(`${API_URL}/slides`),
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/credentials`) 
        ]);

        if (sliRes.status === 'fulfilled') setSlides(sliRes.value.data);
        
        if (srvRes.status === 'fulfilled') {
          // --- OFFICIAL CAC COMPREHENSIVE DATA & ACTUAL PRICES ---
          const officialData = {
            "biz-name": { 
              price: 20000, old: 35000, 
              desc: "Registration of business names for Sole Proprietorships and Partnerships under Part E of CAMA 2020. Includes official Name Reservation, Certificate BN 601, and Certified Extract of Particulars." 
            },
            "company": { 
              price: 65000, old: 90000, 
              desc: "Full incorporation of Private Limited Companies (LTD) with separate legal entity status. Delivery includes Certificate of Incorporation, MEMART, and the essential CAC Status Report." 
            },
            "ngo": { 
              price: 120000, old: 180000, 
              desc: "Registration of Incorporated Trustees for foundations and churches. Entitles trustees to perpetual succession and legal power to hold property in the organization's name." 
            },
            "partnership": { 
              price: 45000, old: 65000, 
              desc: "Limited Liability Partnerships (LLP) formalization. Provides a modern legal structure for joint ventures with limited liability protection and full regulatory compliance." 
            },
            "trademark": { 
              price: 80000, old: 110000, 
              desc: "Intellectual Property protection at the Trademark Registry. Grants exclusive legal rights to brand identity, preventing unauthorized commercial infringement." 
            },
            "export": { 
              price: 75000, old: 95000, 
              desc: "Mandatory NEPC Exporter Registration. Required for formal exportation from Nigeria and access to Federal Government export incentives and grants." 
            },
            "copyright": { 
              price: 50000, old: 70000, 
              desc: "Legal protection for creative, literary, and artistic works. Establishes a verifiable public record of ownership, essential for legal enforcement." 
            }
          };

          const mapped = srvRes.value.data.map(s => ({
            ...s,
            price: officialData[s.service_id]?.price || 0,
            original_price: officialData[s.service_id]?.old || 0,
            description: officialData[s.service_id]?.desc || "Authorized CAC filing node.",
            icon: s.service_id === "company" ? <Building2 size={24}/> : s.service_id === "ngo" ? <Landmark size={24}/> : <Briefcase size={24}/>
          }));
          setCacServices(mapped);
        }

        // --- VERIFICATION VAULT: ACCREDITED PROOFS ---
        if (crdRes.status === 'fulfilled') setCredentials(crdRes.value.data);
        else setCredentials([
          { id: 1, title: 'Accredited Agency', code: 'RC-142280', icon: <Award className="text-[#10b981]" size={28} /> },
          { id: 2, title: 'NEPC Exporter', code: 'NP-55092', icon: <Globe className="text-[#10b981]" size={28} /> },
          { id: 3, title: 'Trademark Registry', code: 'IPR-9901', icon: <Scale className="text-[#10b981]" size={28} /> }
        ]);
      } catch (err) { console.error("Bureau Sync Error"); }
    };
    fetchBureauData();
  }, []);

  const faqs = [
    { q: "How long does a Company Registration take?", a: "With our priority filing node, we typically achieve a 24 to 48-hour turnaround once documentation is verified by CAC officers." },
    { q: "Is the NIN mandatory for all Directors?", a: "Yes, per current regulations, a valid National Identification Number (NIN) is mandatory for all proprietors, directors, and trustees." },
    { q: "What is required for Annual Returns?", a: "Annual returns are mandatory yearly filings to show the company is still active. Failure to file leads to penalties and eventual delisting." }
  ];

  return (
    <div className="bg-white font-sans antialiased text-[#0a192f] overflow-x-hidden">
      
      {/* 1. HERO: Middle-Aligned Strategic Banner */}
      <section className="relative h-[85vh] bg-[#0a192f] flex items-center justify-center text-center px-8">
        <div className="absolute inset-0 opacity-20">
          <img src={slides[currentSlide]?.media_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"} className="w-full h-full object-cover grayscale" alt="" />
        </div>
        <div className="max-w-4xl relative z-10 w-full">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[9px] font-black uppercase tracking-[0.4em] mb-10">
              <Zap size={12} className="animate-pulse" /> Accredited Agency Node
            </div>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-8 leading-tight">
              Strategic <br />
              <span className="text-[#10b981] italic font-serif normal-case tracking-tight">Compliance.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic">
              "Eliminating friction in corporate filings with 100% legal integrity. Professional bridge to the Corporate Affairs Commission."
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/services" className="px-10 py-4 bg-[#10b981] text-white font-black uppercase text-[9px] tracking-[0.2em] rounded-lg shadow-xl hover:bg-white hover:text-[#0a192f] transition-all">Start Registration</Link>
              <Link to="/track" className="px-10 py-4 border border-white/20 text-white font-black uppercase text-[9px] tracking-[0.2em] rounded-lg hover:bg-white/5 transition-all">Track Filing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES: The Professional Catalogue */}
      <section className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="text-center mb-24">
            <span className="text-[#10b981] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Official Mandate</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a192f] tracking-tightest uppercase leading-none italic">Registration <span className="text-slate-300">Nodes.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cacServices.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }} onClick={() => navigate(`/services?id=${service.id}`)} 
                className="p-10 bg-slate-50 rounded-[3rem] border-t-4 border-[#10b981] hover:bg-white hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="w-12 h-12 bg-[#0a192f] text-[#10b981] rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-[#10b981] group-hover:text-white transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#0a192f] text-center mb-6 uppercase tracking-tight">{service.title}</h3>
                  <p className="text-slate-600 text-[11px] text-center leading-relaxed mb-10 font-medium italic opacity-90">{service.description}</p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-200/50">
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-[#0a192f]">₦{service.price.toLocaleString()}</span>
                      {service.original_price > 0 && <span className="text-xs font-bold text-slate-300 line-through decoration-[#10b981]/40">₦{service.original_price.toLocaleString()}</span>}
                    </div>
                    <span className="text-[8px] font-black text-[#10b981] uppercase tracking-[0.3em] italic">Authorized Rate</span>
                  </div>
                  <div className="w-10 h-10 bg-[#0a192f] text-white rounded-full flex items-center justify-center group-hover:bg-[#10b981] transition-all shadow-lg"><ArrowRight size={14} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEWS DESK BRIDGE */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 lg:px-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.5em] mb-4 block">Intelligence Desk</span>
            <h2 className="text-5xl font-black text-[#0a192f] tracking-tightest uppercase mb-8 leading-none italic">News <span className="text-[#10b981]">Briefings.</span></h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed italic">Stay informed with real-time legal briefings and strategic insights from the bureau.</p>
          </div>
          <Link to="/blog" className="px-12 py-5 bg-[#10b981] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:bg-[#0a192f] transition-all flex items-center gap-4 shadow-xl">
            Go to Blog Page <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* 4. VERIFIED PROOFS GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="text-center mb-20">
             <span className="text-[#10b981] font-black text-[9px] uppercase tracking-[0.5em] mb-4 block">Official Verification</span>
             <h2 className="text-4xl font-black text-[#0a192f] tracking-tightest uppercase italic">Verified <span className="text-[#10b981] normal-case">Proofs.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((cred) => (
              <div key={cred.id} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#10b981] group-hover:text-white transition-all">
                  {cred.icon}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{cred.title}</p>
                  <p className="text-2xl font-black text-[#0a192f] tracking-tighter">{cred.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-black text-[#0a192f] text-center mb-16 uppercase tracking-tightest italic">Filing <span className="text-[#10b981]">FAQ.</span></h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-50 transition-colors">
                  <span className="text-base font-black text-[#0a192f]">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-500 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-xs font-medium text-slate-500 italic leading-relaxed border-t border-slate-50 pt-6">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IDENTITY ANCHOR: Doris Yuenva Benson */}
      <section className="py-32 bg-[#0a192f] text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[#10b981]/5 skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-8 lg:px-24 relative z-10 flex flex-col md:flex-row items-center gap-32">
          
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="relative flex-shrink-0">
            {/* PORTRAIT NODE with Pop-out Hover */}
            <motion.div 
              whileHover={{ scale: 1.08, y: -15 }} 
              className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-[16px] border-[#10b981]/20 shadow-pro relative z-10 bg-slate-900 cursor-pointer"
            >
              <img src="https://images.unsplash.com/photo-1556157382-97dee2dcb34e?q=80&w=1000" className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 transition-all duration-1000" alt="Doris Yuenva Benson" />
            </motion.div>
            {/* ACCREDITATION BADGE */}
            <div className="absolute -top-6 -right-6 bg-white p-8 rounded-[2.5rem] shadow-2xl text-[#0a192f] flex flex-col items-center gap-3 z-20">
               <Award size={40} className="text-[#10b981]" />
               <p className="text-3xl font-black tracking-tighter text-[#10b981]">RC 142280</p>
               <p className="text-xl font-black text-[#10b981] mt-[-8px]">Doris Yuenva Benson</p>
            </div>
          </motion.div>

          <div>
            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em] mb-12 block">Identity Anchor</span>
            <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tightest leading-none uppercase italic">Strategic <br/><span className="text-[#10b981] italic font-serif normal-case tracking-tight">Compliance.</span></h2>
            <div className="flex justify-center md:justify-start gap-16 pt-16 border-t border-white/5">
                <div className="text-center">
                  <div className="text-7xl font-black text-white"><Counter end={24} /></div>
                  <div className="text-[12px] font-black uppercase tracking-[0.4em] text-[#10b981] mt-3 leading-tight">Hour<br/>Turnaround</div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-black text-white"><Counter end={100} />%</div>
                  <div className="text-[12px] font-black uppercase tracking-[0.4em] text-[#10b981] mt-3 leading-tight">Secure<br/>Filings</div>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;