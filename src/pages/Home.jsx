import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Briefcase, Users, Globe, Stamp, 
  Scale, Award, Send, Zap, ShoppingCart, Check, 
  Loader2, MousePointer2, Fingerprint, Activity, Trophy
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // --- FLOW DYNAMICS (THE VIBE) ---
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });
  
  // Parallax transforms for that "Elite" depth
  const textY = useTransform(smoothY, [0, 500], [0, 150]);
  const imageScale = useTransform(smoothY, [0, 500], [1, 1.15]);
  const opacityFade = useTransform(smoothY, [0, 400], [1, 0]);

  const handlePurchase = async (service) => {
    if (loadingPayment) return;
    const userEmail = prompt("ENTER OFFICIAL EMAIL FOR REGISTRATION PORTAL:");
    if (!userEmail || !userEmail.includes('@')) {
      alert("Verification failed: Valid email required.");
      return;
    }
    setLoadingPayment(service.id);
    try {
      const response = await axios.post(`${API_URL}/payments/initialize`, {
        email: userEmail,
        amount: service.price,
        serviceName: service.title
      });
      if (response.data?.authorization_url) window.location.href = response.data.authorization_url;
    } catch (err) {
      alert("System synchronizing. Retry in 2 mins.");
    } finally {
      setLoadingPayment(null);
    }
  };

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
      } catch (err) { console.error("Sync Failure", err); }
    };
    syncSystem();
  }, []);

  // Automatic Flowing Slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!isReady) return null;

  return (
    <div className="bg-[#fcfcfc] text-slate-900 overflow-x-hidden selection:bg-green-600 selection:text-white">
      
      {/* --- HERO: KINETIC IMPACT --- */}
      <section className="relative h-screen min-h-[850px] flex items-center overflow-hidden bg-slate-950">
        <motion.div style={{ scale: imageScale, opacity: opacityFade }} className="absolute inset-0 z-0">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img src={slides[currentSlide]?.image_url} className="w-full h-full object-cover brightness-[0.25] grayscale-[20%]" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Floating Ambient Light */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full animate-pulse" />

        <div className="container relative z-10 px-8 mx-auto">
          <motion.div style={{ y: textY }} className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-4 mb-10"
            >
              <span className="w-12 h-[2px] bg-green-500"></span>
              <span className="text-green-500 font-black text-xs uppercase tracking-[0.5em]">Accredited CAC Authority • RC 142280</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[9rem] font-black text-white leading-[0.82] uppercase tracking-tighter mb-10"
            >
              Elite <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 italic font-light">Corporate</span> <br /> Systems
            </motion.h1>

            <div className="flex flex-wrap items-center gap-10 mt-16">
              <Link to="/services" className="group relative px-14 py-7 bg-green-600 text-white font-black uppercase tracking-widest text-[11px] transition-all hover:bg-white hover:text-slate-950 rounded-full shadow-2xl overflow-hidden">
                <span className="relative z-10 flex items-center gap-4">Initialize Registration <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/></span>
              </Link>
              <div className="flex flex-col border-l border-white/10 pl-8">
                 <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <Trophy size={18} className="text-green-500"/> 99.9% Success
                 </div>
                 <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Direct Portal Advantage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR: REMOVING THE "SCANTY" FEEL --- */}
      <div className="relative z-20 -mt-16 px-6">
        <div className="container mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100"
          >
            {[
              { label: "Processing Time", val: "24-72hrs", icon: <Activity className="text-green-500"/> },
              { label: "Active Entities", val: "2,400+", icon: <Users className="text-blue-500"/> },
              { label: "Verification", val: "Instant", icon: <ShieldCheck className="text-emerald-500"/> },
              { label: "Support", val: "24/7 Live", icon: <Globe className="text-violet-500"/> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start border-r last:border-0 border-slate-100">
                <div className="mb-2">{stat.icon}</div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{stat.val}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- SERVICES: THE DENSE CHOREOGRAPHED GRID --- */}
      <section className="py-40 bg-white relative">
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8">
            <div className="max-w-2xl">
              <span className="text-green-600 font-black text-xs uppercase tracking-[0.6em] mb-4 block">Compliance Inventory</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 leading-none uppercase tracking-tighter italic">Regulatory <br /> <span className="font-light not-italic text-slate-300">Solutions</span></h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm font-bold leading-relaxed border-l-4 border-green-500 pl-6">
              Skip the bureaucracy. As accredited agents, we inject your applications directly into the CAC server.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } }
                }}
                whileHover={{ y: -20, transition: { duration: 0.4 } }}
                className="group relative bg-white p-14 rounded-[4rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-green-500/20 hover:shadow-2xl transition-all"
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 mb-10 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 group-hover:rotate-[15deg]">
                    <Fingerprint size={32} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-4 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-12 h-20 overflow-hidden font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-950 tracking-tighter italic">₦{service.price}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Rate</span>
                    </div>
                    
                    <button 
                      onClick={() => handlePurchase(service)}
                      disabled={loadingPayment === service.id}
                      className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all active:scale-90"
                    >
                      {loadingPayment === service.id ? <Loader2 className="animate-spin" /> : <ShoppingCart size={22} />}
                    </button>
                  </div>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[5rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA: FINAL FLOW --- */}
      <section className="bg-slate-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.1)_0%,_transparent_70%)]" />
        <div className="container mx-auto px-8 text-center relative z-10">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-[8rem] font-black text-white uppercase tracking-tighter mb-16 leading-none"
          >
            Start Your <br /> <span className="text-green-500 italic font-light">Empire</span>
          </motion.h2>
          <Link to="/services">
            <button className="px-20 py-10 bg-white text-slate-950 font-black uppercase tracking-[0.4em] text-xs rounded-full hover:bg-green-600 hover:text-white transition-all shadow-2xl shadow-green-600/20">
              Enter Registration Portal
            </button>
          </Link>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 grayscale opacity-40 contrast-125">
             <span className="text-3xl font-black uppercase italic tracking-tighter">Startup.NG</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">Lagos.Tech</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">SME.HUB</span>
             <span className="text-3xl font-black uppercase italic tracking-tighter">Fincl.Africa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;