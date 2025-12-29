import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle, FileText, ArrowRight, 
  Briefcase, Users, Globe, Stamp, Scale, Award, Send, Star, Zap 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- ICONS MAPPING (Pro UI) ---
  const getServiceIcon = (id) => {
    switch(id) {
      case 'biz-name': return <Briefcase className="text-blue-600" />;
      case 'company': return <Users className="text-green-600" />;
      case 'ngo': return <Globe className="text-purple-600" />;
      case 'trademark': return <Stamp className="text-orange-600" />;
      case 'copyright': return <Scale className="text-red-600" />;
      case 'export': return <Send className="text-teal-600" />;
      default: return <Award className="text-gray-600" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Slides
        const slidesRes = await axios.get(`${API_URL}/slides`);
        const heroSlides = slidesRes.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : [
           { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' },
           { image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80' }
        ]);

        // 2. Fetch Services
        const servicesRes = await axios.get(`${API_URL}/services`);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  // --- SLIDER LOGIC ---
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900 bg-white overflow-x-hidden">
      
      {/* =========================================
          1. HERO SECTION (Parallax & Animated) 
         ========================================= */}
      <div className="relative w-full h-[550px] md:h-[750px] bg-gray-900 overflow-hidden">
        <AnimatePresence mode='wait'>
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ scale: 1.1, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image_url}
                  alt="Hero Slide"
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Floating Particles/Stars Animation */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
           <motion.div 
             animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }} 
             transition={{ repeat: Infinity, duration: 5 }}
             className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full blur-sm"
           />
           <motion.div 
             animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }} 
             transition={{ repeat: Infinity, duration: 7 }}
             className="absolute bottom-40 right-20 w-3 h-3 bg-blue-400 rounded-full blur-md"
           />
        </div>

        {/* Main Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Animated Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-2xl"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              CAC Accredited Agent • RC 142280
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Formalize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
                Corporate Identity
              </span>
            </h1>
            
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              We eliminate the stress of bureaucracy. Get your Business Name, Company, or NGO registered with 
              <span className="font-bold text-white"> speed, accuracy, and legal compliance.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/services">
                  <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center gap-2 border border-green-400"
                  >
                     Start Registration <ArrowRight size={20}/>
                  </motion.button>
              </Link>
              
              <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                <CheckCircle size={16} className="text-green-400"/> 24hr Delivery Available
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================
          2. ACCREDITATION & AGENT SECTION
         ========================================= */}
      <div className="bg-[#FDFBF7] py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* LEFT: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-green-700 font-bold uppercase tracking-wider text-sm mb-4">
              <ShieldCheck size={18} /> Regulatory Compliance
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Approved & Accredited by <br />
              <span className="text-green-700 decoration-green-300 underline decoration-4 underline-offset-4">CAC Nigeria</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              REX360 SOLUTIONS operates under strict licensure (RC-142280). Unlike third-party touts, 
              we have <span className="font-bold text-gray-900">direct portal access</span> for priority filing, 
              instant query resolution, and fast retrieval of Certified True Copies (CTC).
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                "Instant Name Search & Reservation",
                "Same-Day Filing Submission",
                "Official Certificate Delivery to Doorstep"
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle size={16}/></div>
                  <span className="font-semibold text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Floating Certificate & Agent Badge */}
          <div className="relative h-[500px] flex items-center justify-center">
            
            {/* Spinning Circle Backdop */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border-2 border-dashed border-gray-200 rounded-full"
            />

            {/* The Certificate Card (Floating) */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full"
            >
               {/* Certificate Header */}
               <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-3">
                   <div className="bg-green-50 p-2 rounded-lg">
                     <FileText size={24} className="text-green-600"/>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 text-sm">CAC Certificate</h4>
                     <p className="text-xs text-green-600 font-bold">Verified Document</p>
                   </div>
                 </div>
                 <Stamp size={24} className="text-gray-300"/>
               </div>

               {/* Certificate Body Placeholder */}
               <div className="bg-slate-50 rounded-lg h-32 flex items-center justify-center mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <FileText size={48} className="text-gray-300 opacity-50"/>
                  <span className="absolute bottom-2 text-[10px] text-gray-400 font-mono">RC-142280582</span>
               </div>

               {/* Agent Badge (Overlapping) */}
               <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                 <div className="relative">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-white"/>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                 </div>
                 <div>
                   <p className="text-xs text-gray-400 uppercase font-bold">Assigned Agent</p>
                   <p className="font-bold text-sm">Active Now</p>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* =========================================
          3. PRODUCTS / SERVICES (Grid)
         ========================================= */}
      <div className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
            
            <div className="text-center mb-16">
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                  <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Our Services
                  </span>
                  <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Choose Your Registration</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">
                    Select the package that suits your business structure. All prices are inclusive of stamp duty and filing fees.
                  </p>
                </motion.div>
            </div>

            {/* THE GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 group relative overflow-hidden"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-green-500 transition-colors duration-300"></div>

                        {/* Icon */}
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                            {getServiceIcon(service.id)}
                        </div>

                        {/* Text */}
                        <div className="relative z-10">
                          <h3 className="font-bold text-xl text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-gray-500 text-sm mb-6 min-h-[40px] line-clamp-2 leading-relaxed">
                            {service.description || "Complete registration including certificate and status report."}
                          </p>
                          
                          <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-4">
                              <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Total Cost</p>
                                <span className="text-green-700 font-bold text-2xl tracking-tight">{service.price}</span>
                              </div>
                              <Link to="/services">
                                <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg">
                                  <ArrowRight size={18}/>
                                </button>
                              </Link>
                          </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
      </div>

      {/* =========================================
          4. TRUST STRIP (Logos)
         ========================================= */}
      <div className="bg-slate-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-8">
            Verified Partner for Nigerian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-2">
               <Zap size={24} className="text-yellow-400"/>
               <h3 className="text-xl font-bold text-white">STARTUP<span className="text-gray-500">NG</span></h3>
             </div>
             <div className="flex items-center gap-2">
               <Globe size={24} className="text-blue-400"/>
               <h3 className="text-xl font-bold text-white">LAGOS<span className="text-gray-500">TECH</span></h3>
             </div>
             <div className="flex items-center gap-2">
               <Star size={24} className="text-green-400"/>
               <h3 className="text-xl font-bold text-white">SME<span className="text-gray-500">GROWTH</span></h3>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;