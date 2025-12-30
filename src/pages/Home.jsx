import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle, FileText, ArrowRight, 
  Briefcase, Users, Globe, Stamp, Scale, Award, Send, Star, Zap, Check 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [certImage, setCertImage] = useState(null);
  const [agentImage, setAgentImage] = useState(null);

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
                <img 
                  src={slide.image_url} 
                  alt="Hero" 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900/90"></div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none">
           <motion.div animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-1/4 left-1/4 w-1 h-1 bg-green-400 rounded-full blur-[2px]" />
           <motion.div animate={{ y: [0, 40, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full blur-[3px]" />
           <motion.div animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }} transition={{ repeat: Infinity, duration: 10 }} className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-yellow-400 rounded-full blur-[2px]" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-2xl"
             >
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
               <span>Accredited CAC Agent • RC 142280</span>
             </motion.div>

             <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
               Formalize Your <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300 animate-gradient-x">
                 Corporate Identity
               </span>
             </h1>
             
             <p className="text-slate-200 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed tracking-wide">
               We eliminate the stress of bureaucracy. Get your Business Name, Company, or NGO registered with 
               <span className="font-semibold text-white"> speed & accuracy.</span>
             </p>
             
             <Link to="/services">
                 <motion.button 
                     whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34, 197, 94, 0.6)" }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-3 mx-auto transition-all border border-green-400/30"
                 >
                    Start Registration <ArrowRight size={20}/>
                 </motion.button>
             </Link>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 text-green-700 font-bold uppercase tracking-wider text-xs mb-4">
              <ShieldCheck size={18} /> Regulatory Compliance
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Approved & Accredited by <br />
              <span className="text-green-700 decoration-4 underline decoration-green-200 underline-offset-8">CAC Nigeria</span>
            </h2>
            
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              REX360 SOLUTIONS operates under strict licensure (RC-142280). Unlike third-party touts, 
              we have <span className="font-bold text-slate-900">direct portal access</span> for priority filing, 
              instant query resolution, and fast retrieval of Certified True Copies (CTC).
            </p>

            <div className="space-y-4 mb-10">
              {[
                "Instant Name Search & Reservation",
                "Same-Day Filing Submission",
                "Official Certificate Delivery to Doorstep"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-green-200 transition-colors"
                >
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full"><Check size={16}/></div>
                  <span className="font-semibold text-slate-700 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="inline-flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-lg border border-slate-100">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 p-0.5">
                    {agentImage ? (
                      <img src={agentImage} alt="Agent" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center rounded-full"><Users size={20} className="text-slate-400"/></div>
                    )}
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Accredited Agent</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <p className="font-bold text-slate-900 text-sm">Active Now</p>
                    </div>
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="relative"
          >
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
               className="absolute -top-10 -right-10 w-40 h-40 border-[3px] border-dashed border-green-300 rounded-full z-0 opacity-50 hidden md:block"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
               className="absolute -bottom-10 -left-10 w-32 h-32 border-[2px] border-dotted border-blue-300 rounded-full z-0 opacity-50 hidden md:block"
             />

             <div className="bg-white p-3 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 relative h-[500px] md:h-[650px] w-full flex items-center justify-center group">
                    
                    {certImage ? (
                        <img 
                          src={certImage} 
                          alt="CAC Certificate" 
                          className="w-full h-full object-contain bg-white transition-transform duration-700 group-hover:scale-[1.02]" 
                        />
                    ) : (
                        <div className="text-center p-10">
                            <FileText size={64} className="text-slate-300 mx-auto mb-4"/>
                            <p className="text-slate-400 font-bold">Please Upload Certificate in Admin</p>
                        </div>
                    )}

                    <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                        <Award size={12} className="text-white"/> VERIFIED DOCUMENT
                    </div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>

      <div className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Official Packages
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-4">Choose Your Registration</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 flex flex-col group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-white group-hover:shadow-md transition-all">
                            {getServiceIcon(service.id)}
                        </div>

                        <h3 className="font-bold text-xl text-slate-900 mb-4 relative z-10">{service.title}</h3>
                        
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-grow relative z-10">
                           {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 relative z-10">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">All Inclusive</p>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 font-extrabold text-2xl">{service.price}</span>
                                    {/* Added Strikethrough Display strictly here */}
                                    {service.original_price && (
                                        <span className="text-gray-400 line-through text-xs font-medium -mt-1">{service.original_price}</span>
                                    )}
                                </div>
                            </div>
                            <Link to="/services">
                              <motion.button 
                                whileHover={{ rotate: 90 }}
                                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-green-600 shadow-lg transition-colors"
                              >
                                <ArrowRight size={20}/>
                              </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      <div className="bg-slate-900 py-16 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">Trusted by Nigerian Businesses</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-3">
               <Zap size={28} className="text-amber-400 fill-amber-400"/>
               <h3 className="text-2xl font-bold text-white tracking-tight">STARTUP<span className="text-slate-600">NG</span></h3>
             </div>
             <div className="flex items-center gap-3">
               <Globe size={28} className="text-blue-400"/>
               <h3 className="text-2xl font-bold text-white tracking-tight">LAGOS<span className="text-slate-600">TECH</span></h3>
             </div>
             <div className="flex items-center gap-3">
               <Star size={28} className="text-green-400 fill-green-400"/>
               <h3 className="text-2xl font-bold text-white tracking-tight">SME<span className="text-slate-600">GROWTH</span></h3>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;