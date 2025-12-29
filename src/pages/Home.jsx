import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Award, CheckCircle } from 'lucide-react'; 

// API Link
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
        
        if (heroSlides.length > 0) {
          setSlides(heroSlides);
        } else {
          // Backup if database is empty
          setSlides([
             { image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80' }
          ]);
        }
      } catch (err) {
        console.error("Error loading slides:", err);
      }
    };
    fetchSlides();
  }, []);

  // 2. Auto-Play Animation
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900">
      
      {/* --- HERO SECTION (SLIDER) --- */}
      <div className="relative w-full bg-gray-900">
        
        {/* ZOOM FIX: h-[500px] keeps it professional but fits mobile screens */}
        <div className="relative h-[500px] md:h-[700px] w-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image_url}
                alt="Slide"
                className="w-full h-full object-cover object-top" // object-top keeps faces visible
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* ANIMATED TEXT CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-fade-in-up">
            <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase mb-6 shadow-md inline-block">
              Regulatory Compliance
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
              Accredited by the <br />
              <span className="text-green-400">Corporate Affairs Commission</span>
            </h1>
            <p className="text-gray-100 text-sm md:text-lg max-w-2xl mx-auto mb-8 font-light">
              Operating under full licensure, REX360 SOLUTIONS ensures that your pre-incorporation 
              and post-incorporation filings meet strict statutory requirements.
            </p>
            <div className="flex space-x-4 justify-center">
              <Link
                to="/services"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg hover:-translate-y-1"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- INFO SECTION (Why Accreditation Matters) --- */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border-l-4 border-green-600">
               <ShieldCheck className="text-green-600 shrink-0" size={32} />
               <div>
                 <h3 className="font-bold text-xl text-gray-800 mb-2">Why Accreditation Matters</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Only accredited agents have direct access to the CAC portal for priority filing, 
                   query resolution, and instant retrieval of certified true copies (CTC).
                 </p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border-l-4 border-blue-600">
               <CheckCircle className="text-blue-600 shrink-0" size={32} />
               <div>
                 <h3 className="font-bold text-xl text-gray-800 mb-2">Official Licensing</h3>
                 <p className="text-gray-600 leading-relaxed">
                   We are fully licensed to handle Business Names, Limited Liability Companies, 
                   NGOs, and Trademark registrations without third-party delays.
                 </p>
               </div>
            </div>
          </div>

          {/* Right: Certificate Display (Placeholder for Certificate Image) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-green-600 rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
               {/* Replace this URL with your actual Certificate Image URL in Admin */}
               <img 
                 src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80" 
                 alt="CAC Certificate" 
                 className="rounded-xl w-full h-64 md:h-80 object-cover"
               />
               <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
                 <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                 <p className="text-green-600 font-bold flex items-center gap-1">
                   <Award size={14}/> Active & Accredited
                 </p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- TRUSTED BY SECTION --- */}
      <div className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
            Trusted by Nigerian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <h3 className="text-xl font-bold text-gray-300">STARTUP NIGERIA</h3>
             <h3 className="text-xl font-bold text-gray-300">LAGOS TECH</h3>
             <h3 className="text-xl font-bold text-gray-300">SME GROWTH</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;