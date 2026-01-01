import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, FileText, ArrowRight, 
  Briefcase, Users, Globe, Stamp, Scale, Award, Send, Star, Zap, Check, ShoppingCart 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [certImage, setCertImage] = useState(null);
  const [agentImage, setAgentImage] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(null);

  const getServiceIcon = (id) => {
    switch(id) {
      case 'biz-name': return <Briefcase className="text-blue-600" />;
      case 'company': return <Users className="text-emerald-600" />;
      case 'ngo': return <Globe className="text-violet-600" />;
      case 'trademark': return <Stamp className="text-orange-500" />;
      case 'copyright': return <Scale className="text-rose-600" />;
      case 'export': return <Send className="text-cyan-600" />;
      default: return <Award className="text-amber-500" />;
    }
  };

  // NEW: Course-style Payment Initialization Logic
  const handlePurchase = async (service) => {
    const userEmail = prompt("Enter your email to receive your registration portal access:");
    if (!userEmail) return;

    setLoadingPayment(service.id);
    try {
      const res = await axios.post(`${API_URL}/payments/initialize`, {
        email: userEmail,
        amount: service.price,
        serviceName: service.title
      });
      
      // Redirect to secure Paystack Checkout
      window.location.href = res.data.authorization_url;
    } catch (err) {
      alert("Payment system is currently updating. Please try again in 5 minutes.");
    } finally {
      setLoadingPayment(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slidesRes = await axios.get(`${API_URL}/slides`);
        const heroSlides = slidesRes.data.filter(s => s.section === 'hero');
        const certSlide = slidesRes.data.find(s => s.section === 'certificate');
        const agentSlide = slidesRes.data.find(s => s.section === 'agent');

        setSlides(heroSlides.length > 0 ? heroSlides : [
           { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' }
        ]);
        if (certSlide) setCertImage(certSlide.image_url);
        if (agentSlide) setAgentImage(agentSlide.image_url);

        const servicesRes = await axios.get(`${API_URL}/services`);
        setServices(servicesRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900 bg-white overflow-x-hidden selection:bg-green-100 selection:text-green-900">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[600px] md:h-[850px] bg-slate-900 overflow-hidden">
        <AnimatePresence mode='wait'>
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ scale: 1.2, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img src={slide.image_url} alt="Hero" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900/90"></div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl">
             <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
               <span>Accredited CAC Agent • RC 142280</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">Formalize Your <br /> Corporate Identity</h1>
             <p className="text-slate-200 text-lg md:text-2xl max-w-2xl mx-auto mb-10">Stress-free registration with speed and accuracy.</p>
             <Link to="/services">
                 <button className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-3 mx-auto">Start Registration <ArrowRight size={20}/></button>
             </Link>
          </motion.div>
        </div>
      </div>

      {/* ACCREDITATION SECTION */}
      <div className="bg-[#F8FAFC] py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8">Approved & Accredited by CAC Nigeria</h2>
            <p className="text-slate-600 text-lg mb-8">We have direct portal access for priority filing and fast retrieval of certificates.</p>
            <div className="space-y-4 mb-10">
              {["Instant Name Search", "Same-Day Filing", "Official Delivery"].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full"><Check size={16}/></div>
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CERTIFICATE DISPLAY */}
          <div className="bg-white p-3 rounded-3xl shadow-2xl border border-slate-100">
            <div className="bg-slate-50 rounded-2xl overflow-hidden h-[500px] flex items-center justify-center">
              {certImage ? <img src={certImage} alt="CAC Certificate" className="w-full h-full object-contain" /> : <p className="text-slate-400">Waiting for Certificate Upload...</p>}
            </div>
          </div>
        </div>
      </div>

      {/* PRICING SECTION - UPDATED FOR STRIKE PRICE & PAYMENT */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Choose Your Registration</h2>
                <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full mt-4"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <motion.div 
                        key={index} 
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[2rem] shadow-lg p-8 border border-slate-100 flex flex-col group relative"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                            {getServiceIcon(service.id)}
                        </div>

                        <h3 className="font-bold text-xl text-slate-900 mb-4">{service.title}</h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-grow">{service.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">All Inclusive</p>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 font-extrabold text-2xl">{service.price}</span>
                                    {/* STRIKE PRICE DISPLAY */}
                                    {service.original_price && (
                                        <span className="text-gray-400 line-through text-xs font-medium -mt-1">{service.original_price}</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* NEW: Automated Purchase Button */}
                            <button 
                                onClick={() => handlePurchase(service)}
                                disabled={loadingPayment === service.id}
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${loadingPayment === service.id ? 'bg-gray-400' : 'bg-slate-900 hover:bg-green-600 text-white'}`}
                            >
                                {loadingPayment === service.id ? <Zap size={18} className="animate-spin" /> : <ShoppingCart size={20}/>}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
      
      {/* TRUST FOOTER */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">Trusted by Nigerian Businesses</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
             <div className="flex items-center gap-3"><Zap size={28} className="text-amber-400"/><h3 className="text-2xl font-bold text-white">STARTUP<span className="text-slate-600">NG</span></h3></div>
             <div className="flex items-center gap-3"><Globe size={28} className="text-blue-400"/><h3 className="text-2xl font-bold text-white">LAGOS<span className="text-slate-600">TECH</span></h3></div>
             <div className="flex items-center gap-3"><Star size={28} className="text-green-400"/><h3 className="text-2xl font-bold text-white">SME<span className="text-slate-600">GROWTH</span></h3></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;