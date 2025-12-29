import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, FileText, ArrowRight, Briefcase, Users, Globe, Stamp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. Fetch Slides & Services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Slides
        const slidesRes = await axios.get(`${API_URL}/slides`);
        const heroSlides = slidesRes.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : [
           { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' }
        ]);

        // Fetch Services (Products)
        const servicesRes = await axios.get(`${API_URL}/services`);
        if (servicesRes.data.length > 0) {
            setServices(servicesRes.data);
        } else {
            // Fallback if DB is empty
            setServices([
                { id: 'biz', title: 'Business Name', price: '₦35,000', description: 'Sole Proprietorship registration.' },
                { id: 'ltd', title: 'Company (Ltd)', price: '₦80,000', description: 'Limited Liability Company.' },
                { id: 'ngo', title: 'NGO / Church', price: '₦140,000', description: 'Incorporated Trustees.' },
                { id: 'tm', title: 'Trademark', price: '₦50,000', description: 'Protect your brand identity.' },
            ]);
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchData();
  }, []);

  // 2. Auto-Play Slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900">
      
      {/* --- 1. HERO SLIDER (Original Look + Zoom Fix) --- */}
      <div className="relative w-full h-[500px] md:h-[650px] bg-gray-900 overflow-hidden">
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

        {/* Animated Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Accredited CAC Agent
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Formalize Your <br />
              <span className="text-green-400">Corporate Identity</span>
            </h1>
            <p className="text-gray-100 text-lg max-w-2xl mx-auto mb-8 font-light">
              We provide seamless registration services strictly adhering to the Companies and Allied Matters Act (CAMA) 2020.
            </p>
            <Link to="/services" className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold transition inline-flex items-center gap-2">
               Start Registration <ArrowRight size={18}/>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* --- 2. ACCREDITED SECTION (Exact Look from Screenshot) --- */}
      <div className="bg-[#FDFBF7] py-20 border-b border-gray-200">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
              Regulatory Compliance
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Accredited by the <br />
              Corporate Affairs Commission
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Operating under full licensure, REX360 SOLUTIONS ensures that your pre-incorporation and post-incorporation filings meet strict statutory requirements.
            </p>
            
            {/* The Green Border Box */}
            <div className="border-l-4 border-green-600 pl-6 py-2 mb-8 bg-white/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="text-green-600" size={20}/> Why Accreditation Matters
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Only accredited agents have direct access to the CAC portal for priority filing, query resolution, and instant retrieval of certified true copies (CTC).
              </p>
            </div>
          </div>

          {/* Right Certificate Placeholder */}
          <div className="relative">
            <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform rotate-2 hover:rotate-0 transition duration-500">
               <div className="aspect-[4/3] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                  <FileText size={48} className="mb-2 opacity-20" />
                  <span className="text-xs uppercase font-bold opacity-40">Official Certificate</span>
               </div>
               <div className="mt-4 flex justify-between items-center">
                 <div>
                   <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                   <p className="text-green-600 font-bold text-sm flex items-center gap-1">
                     <CheckCircle size={12}/> Active
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase">License No.</p>
                   <p className="text-gray-800 font-bold text-sm">RC-142280</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. PRODUCTS LIST (Added Back So People Can Buy) --- */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Our Packages</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">Start Your Registration</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl hover:shadow-xl transition-all p-6 border border-slate-100 group">
                        <div className="w-12 h-12 bg-white text-green-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                            <Briefcase size={24}/>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 min-h-[40px] line-clamp-2">
                           {service.description || "Professional CAC registration service."}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <span className="text-green-700 font-bold text-lg">{service.price}</span>
                            <Link to="/services" className="text-sm font-bold text-gray-900 hover:text-green-600 flex items-center gap-1">
                                Order Now <ArrowRight size={14}/>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- 4. TRUSTED BY --- */}
      <div className="bg-slate-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
            Trusted by Nigerian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
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