import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Briefcase, Users, Globe, Stamp, 
  Scale, Award, Send, Zap, ShoppingCart, Check, 
  Loader2, MousePointer2, Fingerprint
} from 'lucide-react';

// --- PRO-MEASURE: CENTRALIZED CONNECTION CONFIG ---
const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  // State Monitoring
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Flow-Motion Dynamics
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 1. STRICT CONNECTION: PAYMENT ARCHITECTURE
  const handlePurchase = async (service) => {
    if (loadingPayment) return;

    // Professional Validation
    const userEmail = prompt("ENTER OFFICIAL EMAIL FOR REGISTRATION PORTAL:");
    if (!userEmail || !userEmail.includes('@')) {
      alert("Professional verification failed: A valid email is required.");
      return;
    }

    setLoadingPayment(service.id);
    
    try {
      // Direct Tunnel to Backend
      const response = await axios.post(`${API_URL}/payments/initialize`, {
        email: userEmail,
        amount: service.price,
        serviceName: service.title
      });

      if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("Gateway Handshake Failed");
      }
    } catch (err) {
      console.error("[PRO-LOG]: Connection Error", err);
      alert("The payment gateway is currently synchronizing. Please try again in 2 minutes.");
    } finally {
      setLoadingPayment(null);
    }
  };

  // 2. COMPREHENSIVE DATA SYNC
  useEffect(() => {
    setIsReady(true);
    const syncSystem = async () => {
      try {
        const [sRes, serRes] = await Promise.all([
          axios.get(`${API_URL}/slides`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/services`).catch(() => ({ data: [] }))
        ]);
        
        const heroSlides = sRes.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : [{ image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000' }]);
        setServices(serRes.data);
      } catch (err) {
        console.error("[PRO-LOG]: API Sync Failure", err);
      }
    };
    syncSystem();
  }, []);

  // Hydration Guard (Prevents Minified Error #418)
  if (!isReady) return null;

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden selection:bg-green-600 selection:text-white">
      
      {/* --- HERO: THE BRAND IMPACT --- */}
      <section className="relative h-screen min-h-[850px] flex items-center overflow-hidden bg-slate-950">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ scale: 1.2, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 z-0"
          >
            <img src={slides[currentSlide]?.image_url} className="w-full h-full object-cover brightness-[0.3] grayscale-[40%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 px-8 mx-auto">
          <div className="max-w-5xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-10">
              <span className="w-12 h-[2px] bg-green-500"></span>
              <span className="text-green-500 font-black text-xs uppercase tracking-[0.4em]">Accredited CAC Authority • RC 142280</span>
            </motion.div>

            <h1 className="text-6xl md:text-[8.5rem] font-black text-white leading-[0.85] uppercase tracking-tighter mb-10">
              Direct <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 italic font-light">Corporate</span> <br /> Access
            </h1>

            <div className="flex flex-wrap items-center gap-10 mt-16">
              <Link to="/services" className="group relative px-14 py-7 bg-green-600 text-white font-black uppercase tracking-widest text-[11px] transition-all hover:bg-white hover:text-slate-950 rounded-full shadow-2xl overflow-hidden">
                <span className="relative z-10 flex items-center gap-4">Start Registration <ArrowRight size={18}/></span>
              </Link>
              <p className="text-slate-500 max-w-xs text-sm font-bold leading-relaxed border-l border-white/20 pl-8">
                Eliminate manual delays. We provide immediate portal access for CAC filings.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Scroll Progress (Flow Component) */}
        <motion.div style={{ scaleX: smoothProgress }} className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 origin-left z-20" />
      </section>

      {/* --- SERVICES: THE DENSE GRID --- */}
      <section className="py-40 bg-[#f8f9fa] relative overflow-hidden">
        {/* Subtle Decorative Flow Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 leading-none uppercase tracking-tighter">Regulatory <br /> Inventory</h2>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-black text-slate-200 uppercase tracking-tighter mb-2">Tier One</div>
              <div className="h-1 w-32 bg-green-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div 
                key={idx} whileHover={{ y: -15 }}
                className="group relative bg-white p-14 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-10 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <Fingerprint size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-4">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-12 h-20 overflow-hidden">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-950 tracking-tighter">₦{service.price}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Full Compliance Fee</span>
                    </div>
                    
                    <button 
                      onClick={() => handlePurchase(service)}
                      disabled={loadingPayment === service.id}
                      className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition-all disabled:bg-slate-200"
                    >
                      {loadingPayment === service.id ? <Loader2 className="animate-spin" /> : <ShoppingCart size={22} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST FOOTER --- */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 grayscale opacity-30 contrast-125">
             <span className="text-3xl font-black uppercase italic tracking-tighter">Startup.NG</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">Lagos.Tech</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">SME.HUB</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">Fincl.Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;