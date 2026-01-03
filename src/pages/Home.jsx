import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Building2, Landmark, 
  FileSignature, History, Briefcase, Stamp, Award, ShoppingCart, 
  CheckCircle2, UserCheck, Star, Zap, Globe
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [agentData, setAgentData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cacServices, setCacServices] = useState([]); // State for dynamic services

  // --- DYNAMIC DATA SYNC: Pulling Services, Slides, and Agent ---
  useEffect(() => {
    const syncAgencyData = async () => {
      try {
        const [sliRes, agtRes, srvRes] = await Promise.all([
          axios.get(`${API_URL}/slides`),
          axios.get(`${API_URL}/agent-profile`),
          axios.get(`${API_URL}/services`) // Fetches editable names and prices
        ]);
        setSlides(sliRes.data);
        setAgentData(agtRes.data);
        
        // Map icons and border colors to the backend data
        const icons = {
          "biz-name": <Briefcase size={28}/>,
          "company": <Building2 size={28}/>,
          "ngo": <Landmark size={28}/>,
          "partnership": <FileSignature size={28}/>,
          "trademark": <Stamp size={28}/>,
          "export": <History size={28}/>,
          "copyright": <ShieldCheck size={28}/>
        };

        const colors = {
          "biz-name": "border-blue-500",
          "company": "border-green-500",
          "ngo": "border-purple-500",
          "partnership": "border-indigo-500",
          "trademark": "border-amber-500",
          "export": "border-teal-500",
          "copyright": "border-red-500"
        };

        const mappedServices = srvRes.data.map(s => ({
          ...s,
          icon: icons[s.id] || <Briefcase size={28}/>,
          color: colors[s.id] || "border-slate-500"
        }));

        setCacServices(mappedServices);
      } catch (err) { 
        console.log("Using default agency assets"); 
      }
    };
    syncAgencyData();
  }, []);

  // --- KINETIC FLOW: Replaying through 5+ Slides ---
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  return (
    <div className="bg-white font-sans antialiased">
      
      {/* --- HERO: KINETIC TEXT & IMAGE REPLAY --- */}
      <section className="relative h-screen bg-slate-950 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }} 
            animate={{ opacity: 0.3, scale: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {slides[currentSlide]?.media_type === 'video' ? (
              <video src={slides[currentSlide].media_url} autoPlay loop muted className="w-full h-full object-cover" />
            ) : (
              <img 
                src={slides[currentSlide]?.media_url || "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000"} 
                className="w-full h-full object-cover"
                alt="Agency Visual"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-premium-gold text-xs font-black uppercase tracking-widest mb-10 backdrop-blur-md">
                <Zap size={14} className="animate-pulse" /> {slides[currentSlide]?.label || "Official CAC Accredited Agent • RC 142280"}
              </div>
              
              <h1 className="text-white text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-10">
                {slides[currentSlide]?.title_part_1 || "TRUSTED"} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-yellow-200 italic font-serif">
                   {slides[currentSlide]?.title_part_2 || "Legal Partners."}
                </span>
              </h1>
              
              <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed">
                {slides[currentSlide]?.subtitle || "We bridge the gap between Nigerian entrepreneurs and the Corporate Affairs Commission."}
              </p>

              <div className="flex flex-wrap gap-6">
                <Link to="/services" className="px-12 py-5 bg-premium-gold text-slate-950 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-all shadow-2xl">
                  Start Registration
                </Link>
                <Link to="/track" className="px-12 py-5 border-2 border-white/20 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all">
                  Track Filing
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* --- SERVICE GRID: DYNAMIC PRICES & TITLES --- */}
      <section className="py-32 bg-slate-50" id="services">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-24">
            <span className="text-premium-gold font-black text-xs uppercase tracking-[0.4em] mb-4 block">Official Catalogue</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Registration <span className="text-slate-300">Nodes.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cacServices.map((service) => (
              <motion.div 
                key={service.id} 
                whileHover={{ y: -10 }} 
                onClick={() => navigate(`/services?id=${service.id}`)}
                className={`group p-10 bg-white rounded-[2.5rem] border-t-8 ${service.color} shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="w-16 h-16 bg-slate-900 text-premium-gold rounded-2xl flex items-center justify-center mb-10 group-hover:bg-premium-gold group-hover:text-slate-900 transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-10 italic">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">
                        ₦{Number(service.price).toLocaleString()}
                      </span>
                      {service.original_price && (
                        <span className="text-sm font-bold text-slate-400 line-through decoration-red-500/60">
                          ₦{Number(service.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em] mt-1">Official Rate</span>
                  </div>
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AGENT CREDENTIALS --- */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-premium-gold/5 skew-x-12 translate-x-32" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl">
                <img 
                  src={agentData?.profile_url || "https://images.unsplash.com/photo-1556157382-97dee2dcb34e?q=80&w=1000"} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt="Lead Agent"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-premium-gold p-10 rounded-[2rem] shadow-2xl text-slate-950">
                 <UserCheck size={40} />
              </div>
            </div>
            <div>
              <span className="text-premium-gold font-black text-xs uppercase tracking-[0.4em] mb-6 block">Accredited Identity</span>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">Strategic <br/>Compliance.</h2>
              <div className="space-y-8 text-slate-300 text-lg leading-relaxed">
                <p>{agentData?.bio || "Ensuring your entity is birthed on a solid foundation with 100% legal integrity."}</p>
                <div className="grid grid-cols-2 gap-10 pt-6">
                  <div>
                    <p className="text-4xl font-black text-white">24Hr</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-premium-gold">Turnaround</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-premium-gold">Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;