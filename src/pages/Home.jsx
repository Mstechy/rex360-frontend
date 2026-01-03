import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Briefcase, Users, Globe, 
  Stamp, Scale, Award, Send, Star, Zap, ShoppingCart, Check 
} from 'lucide-react';

// --- PRO MEASURES & CONSTANTS ---
const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const SLIDE_DURATION = 6000; // Exact timing for transitions

const Home = () => {
  // 1. STATE MANAGEMENT (Measured Initial States)
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [certImage, setCertImage] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // 2. SCROLL DYNAMICS (The "Flowy" feel)
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // 3. ICON MAPPING (Pro Logic)
  const getServiceIcon = (id) => {
    const iconMap = {
      'biz-name': <Briefcase className="text-blue-600" size={24} />,
      'company': <Users className="text-emerald-600" size={24} />,
      'ngo': <Globe className="text-violet-600" size={24} />,
      'trademark': <Stamp className="text-orange-500" size={24} />,
      'copyright': <Scale className="text-rose-600" size={24} />,
      'export': <Send className="text-cyan-600" size={24} />,
    };
    return iconMap[id] || <Award className="text-amber-500" size={24} />;
  };

  // 4. ERROR-GUARDED DATA FETCHING
  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const [slidesRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/slides`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/services`).catch(() => ({ data: [] }))
        ]);

        const hero = slidesRes.data.filter(s => s.section === 'hero');
        setSlides(hero.length > 0 ? hero : [{ image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80' }]);
        
        const cert = slidesRes.data.find(s => s.section === 'certificate');
        if (cert) setCertImage(cert.image_url);
        
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Critical: Home Data Sync Failed", err);
      }
    };
    fetchData();
  }, []);

  // 5. AUTO-SLIDE LOGIC (Precise Timing)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides]);

  // 6. HYDRATION SAFEGUARD (Prevents Error #418)
  if (!isMounted) return null;

  return (
    <div className="relative w-full bg-white overflow-x-hidden antialiased">
      
      {/* SECTION 1: THE IMMERSIVE HERO */}
      <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => index === currentSlide && (
            <motion.div
              key={slide.id || index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="absolute inset-0"
            >
              <img src={slide.image_url} alt="Background" className="w-full h-full object-cover brightness-50 grayscale-[20%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="container relative z-10 px-6 mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-white/5 backdrop-blur-md border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Accredited Agent • RC 142280</span>
            </div>
            
            <h1 className="text-5xl md:text-[5.5rem] font-black text-white leading-[0.9] uppercase tracking-tighter mb-8">
              Corporate <br /> <span className="text-green-500">Excellence</span> <br /> Redefined
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto mb-10 font-medium">
              Nigeria's premier portal for fast-track CAC registrations and regulatory compliance.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/services" className="inline-flex items-center gap-4 px-10 py-5 bg-green-600 text-white rounded-full font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-green-500 transition-all">
                Launch Application <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: THE "FLOW" GRID (Services) */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none uppercase mb-6">Service <br /> <span className="text-green-600">Inventory</span></h2>
              <div className="h-1.5 w-20 bg-green-600 rounded-full" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Scroll to explore categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={service.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="mb-8 p-4 w-fit bg-slate-50 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                  {getServiceIcon(service.id)}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 h-16 overflow-hidden">{service.description}</p>
                
                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Fee Structure</span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-slate-900">₦{service.price}</span>
                      {service.original_price && <span className="text-xs text-slate-400 line-through">₦{service.original_price}</span>}
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {}} // Integration logic
                    className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:bg-green-600 transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ACCREDITATION (The "Measure" of Trust) */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-green-600 font-black text-xs uppercase tracking-[0.4em] mb-6">Official Credentials</span>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-[0.95] uppercase mb-8">Verified <br /> CAC Presence</h2>
            <p className="text-slate-500 text-lg mb-10 max-w-md font-medium leading-relaxed">
              Our accreditation allows us priority access to the Corporate Affairs Commission servers, ensuring your business is registered in record time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Real-time Search', 'Portal Access', 'Legal Stamping', 'Express Delivery'].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-1 bg-green-100 text-green-700 rounded-full"><Check size={14} strokeWidth={3} /></div>
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-tight">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <motion.div 
              initial={{ rotate: 5, scale: 0.9, opacity: 0 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="bg-slate-900 p-4 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]"
            >
              <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[4/5] flex items-center justify-center">
                {certImage ? (
                  <img src={certImage} alt="Certificate" className="w-full h-full object-cover" />
                ) : (
                  <ShieldCheck size={100} className="text-slate-100 animate-pulse" />
                )}
              </div>
            </motion.div>
            {/* Design Element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500 rounded-full blur-[80px] opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* SECTION 4: TRUST BAR (Strict Minimalism) */}
      <footer className="py-20 bg-slate-900 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mb-12">Authorized Corporate Network</p>
          <div className="flex flex-wrap justify-center gap-16 md:gap-32 grayscale opacity-40">
             <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter italic">STARTUP.NG</div>
             <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter italic">LAGOS.TECH</div>
             <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter italic">SME.HUB</div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;