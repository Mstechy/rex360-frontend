import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Get the API link
const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. Fetch Slides
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_URL}/slides`);
        // Use 'hero' slides, or fallback to the uploaded ones
        const heroSlides = res.data.filter(s => s.section === 'hero');
        setSlides(heroSlides.length > 0 ? heroSlides : res.data); 
      } catch (err) {
        console.error("Error loading slides:", err);
      }
    };
    fetchSlides();
  }, []);

  // 2. Auto-Play (5 seconds)
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="font-sans text-gray-900">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full bg-gray-900">
        
        {/* FIX FOR ZOOM: 
           h-[400px] -> Height on Phone (Shorter, so less zoom)
           md:h-[600px] -> Height on Laptop (Taller, for impact)
           object-top -> Keeps faces/heads visible if cropped
        */}
        <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden">
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
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase mb-4">
            Accredited CAC Agent
          </span>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Formalize Your <br />
            <span className="text-green-400">Corporate Identity.</span>
          </h1>
          <p className="text-gray-200 text-sm md:text-lg max-w-2xl mb-8">
            We provide seamless registration services strictly adhering to the
            Companies and Allied Matters Act (CAMA) 2020.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/services"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Start Registration →
            </Link>
          </div>
        </div>
      </div>

      {/* --- TRUSTED BY SECTION --- */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">
            Trusted by Nigerian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale">
             <h3 className="text-xl font-bold text-gray-400">STARTUP NIGERIA</h3>
             <h3 className="text-xl font-bold text-gray-400">LAGOS TECH</h3>
             <h3 className="text-xl font-bold text-gray-400">SME GROWTH</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;