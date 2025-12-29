import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // THIS BRINGS THE ANIMATIONS BACK
import { ShieldCheck, Award, CheckCircle, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. Fetch Slides
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/slides`);
        const heroSlides = res.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : [
           { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' }
        ]);
      } catch (err) {
        console.error("Error loading slides", err);
      }
    };
    fetchSlides();
  }, []);

  // 2. Auto-Play
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      
      {/* --- HERO SECTION (ANIMATED) --- */}
      <div className="relative w-full bg-gray-900 overflow-hidden">
        
        {/* Slider Images (Zoom Fixed) */}
        <div className="relative h-[550px] md:h-[750px] w-full">
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
        </div>

        {/* ANIMATED TEXT OVERLAY */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-green-600/90 backdrop-blur text-white px-6 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase mb-6 inline-block shadow-lg border border-green-400/30">
              Accredited CAC Agent
            </span>
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Formalize Your <br />
              <span className="text-green-400">Corporate Identity</span>
            </h1>
            <p className="text-gray-100 text-sm md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
              We provide seamless registration services strictly adhering to the
              Companies and Allied Matters Act (CAMA) 2020.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-600/20"
                >
                  Start Registration →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- SECTION 2: WHY ACCREDITATION MATTERS --- */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Regulatory Compliance</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Why Use an Accredited Agent?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Direct Portal Access", 
                desc: "We have direct access to the CAC portal for priority filing and instant query resolution.",
                color: "text-blue-600", bg: "bg-blue-50"
              },
              { 
                icon: Award, 
                title: "Official Licensure", 
                desc: "Fully licensed to handle Business Names, LLCs, NGOs, and Trademarks legally.",
                color: "text-green-600", bg: "bg-green-50"
              },
              { 
                icon: FileText, 
                title: "Certified Copies", 
                desc: "Get your Certified True Copies (CTC) and certificates faster than third-party delays.",
                color: "text-purple-600", bg: "bg-purple-50"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECTION 3: CERTIFICATES & TRUST --- */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-green-500/30">
              <CheckCircle size={14}/> Verified & Secure
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Official Certifications</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              REX360 SOLUTIONS is duly registered and accredited. We operate with full transparency and legal backing.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl">
                 <h4 className="text-2xl font-bold text-green-400">100%</h4>
                 <p className="text-xs text-slate-400 uppercase">Approval Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/10 p-4 rounded-xl">
                 <h4 className="text-2xl font-bold text-blue-400">24/7</h4>
                 <p className="text-xs text-slate-400 uppercase">Support</p>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
             {/* Certificate Mockup */}
             <div className="bg-white p-3 rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden relative">
                  {/* Placeholder for Certificate - Upload real one in Admin later */}
                  <img 
                    src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80" 
                    alt="Certificate" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/50 text-white px-4 py-2 rounded font-bold backdrop-blur-sm">
                      CAC CERTIFICATE
                    </span>
                  </div>
               </div>
             </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Home;