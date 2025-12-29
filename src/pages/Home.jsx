import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle, FileText, ArrowRight, 
  Briefcase, Users, Globe, Stamp, Scale, Award, Send 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to pick the right icon for each service
  const getServiceIcon = (id) => {
    switch(id) {
      case 'biz-name': return <Briefcase />;
      case 'company': return <Users />;
      case 'ngo': return <Globe />;
      case 'trademark': return <Stamp />;
      case 'copyright': return <Scale />;
      case 'export': return <Send />;
      default: return <Award />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Slides
        const slidesRes = await axios.get(`${API_URL}/slides`);
        const heroSlides = slidesRes.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : [
           { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' }
        ]);

        // 2. Fetch Services (The 7 items from your DB)
        const servicesRes = await axios.get(`${API_URL}/services`);
        setServices(servicesRes.data);

      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  // Auto-Play Slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* --- 1. HERO SLIDER (ANIMATED & ZOOM FIXED) --- */}
      <div className="relative w-full h-[500px] md:h-[680px] bg-gray-900 overflow-hidden">
        {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={slide.image_url}
                alt="Slide"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </motion.div>
        ))}

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-green-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg border border-green-400/20">
              Accredited CAC Agent
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Formalize Your <br />
              <span className="text-green-400">Corporate Identity</span>
            </h1>
            <p className="text-gray-100 text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              We provide seamless registration services strictly adhering to the Companies and Allied Matters Act (CAMA) 2020.
            </p>
            <Link to="/services">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-600/20 flex items-center gap-2 mx-auto"
                >
                   Start Registration <ArrowRight size={20}/>
                </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* --- 2. ACCREDITED INFO (THE LAYOUT YOU LIKED) --- */}
      <div className="bg-[#FDFBF7] py-20 border-b border-gray-200">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2 block">
              Regulatory Compliance
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Accredited by the <br />
              Corporate Affairs Commission
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Operating under full licensure, REX360 SOLUTIONS ensures that your pre-incorporation and post-incorporation filings meet strict statutory requirements.
            </p>
            
            <div className="border-l-4 border-green-600 pl-6 py-2 mb-8 bg-white/50 backdrop-blur-sm rounded-r-lg">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="text-green-600" size={20}/> Why Accreditation Matters
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Only accredited agents have direct access to the CAC portal for priority filing, query resolution, and instant retrieval of certified true copies (CTC).
              </p>
            </div>
          </motion.div>

          {/* Certificate Animation */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition duration-500">
               <div className="aspect-[4/3] bg-slate-50 rounded-lg flex flex-col items-center justify-center text-gray-300 relative overflow-hidden">
                  <FileText size={64} className="opacity-20 mb-2"/>
                  <span className="text-xs uppercase font-bold opacity-40">Official Certificate</span>
                  
                  {/* Decorative badge */}
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    Verified
                  </div>
               </div>
               <div className="mt-4 flex justify-between items-center px-2">
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                   <p className="text-green-600 font-bold text-sm flex items-center gap-1">
                     <CheckCircle size={14}/> Active
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">License No.</p>
                   <p className="text-gray-800 font-bold text-sm font-mono">RC-142280</p>
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* --- 3. PRODUCTS GRID (THE 7 SERVICES FROM DB) --- */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Our Packages</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Start Your Registration</h2>
                <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group relative overflow-hidden"
                    >
                        {/* Hover Effect Background */}
                        <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            {/* Dynamically get the right icon */}
                            {getServiceIcon(service.id)}
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                            {service.title}
                        </h3>
                        
                        <p className="text-gray-500 text-sm mb-6 min-h-[40px] line-clamp-2 leading-relaxed">
                           {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-green-700 font-bold text-xl tracking-tight">{service.price}</span>
                            <Link to="/services" className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                                <ArrowRight size={16}/>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

      {/* --- 4. FOOTER TRUST STRIP --- */}
      <div className="bg-slate-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
            Trusted by Nigerian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <h3 className="text-xl font-bold text-gray-800">STARTUP<span className="text-green-600">NG</span></h3>
             <h3 className="text-xl font-bold text-gray-800">LAGOS<span className="text-blue-600">TECH</span></h3>
             <h3 className="text-xl font-bold text-gray-800">SME<span className="text-orange-500">GROWTH</span></h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;