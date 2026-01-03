import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, ArrowRight, PlayCircle, 
  Tag, Sparkles, Search, AlertCircle, 
  Filter, Newspaper, Clock
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://rex360backend.vercel.app/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState("");

  // 1. COMPREHENSIVE DATA SYNC WITH TIMEOUT PROTECTION
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE}/posts`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("REX360 Intelligence Server Unreachable");
        const data = await response.json();
        
        if (Array.isArray(data)) {
            setPosts(data);
        }
      } catch (err) {
        setError(err.name === 'AbortError' ? "Connection Timeout" : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 2. ARCHITECTURAL SEARCH & FILTER LOGIC
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesFilter = activeFilter === 'All' || post.category === activeFilter;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [posts, activeFilter, searchQuery]);

  const categories = useMemo(() => ['All', ...new Set(posts.map(p => p.category || 'News'))], [posts]);

  // 3. MEASURED SKELETON (PRO DENSITY)
  const SkeletonCard = () => (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm h-full">
      <div className="aspect-video bg-slate-200 animate-pulse"></div>
      <div className="p-10 space-y-6">
        <div className="h-4 w-1/4 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-20 w-full bg-slate-100 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 selection:bg-green-600 selection:text-white">
      
      {/* --- HEADER: EDITORIAL AUTHORITY --- */}
      <header className="pt-40 pb-24 px-8 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full -mr-40 -mt-40" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl"
            >
                <Sparkles size={14} className="text-green-400"/> Intelligence Hub
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-black text-slate-950 mb-12 tracking-tighter uppercase leading-[0.85]"
            >
                Knowledge <br/><span className="italic font-light text-green-600">Infrastructure.</span>
            </motion.h1>

            {/* PRO SEARCH BAR */}
            <div className="w-full max-w-2xl relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search regulatory database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-full font-bold text-sm focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-12">
                {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveFilter(cat)} 
                      className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-green-600 text-white shadow-xl translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-100 hover:border-green-200 hover:text-slate-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* --- CONTENT: DENSE GRID ARCHITECTURE --- */}
      <section className="max-w-7xl mx-auto px-8 pb-40">
        <AnimatePresence mode="wait">
          {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-red-100 shadow-sm">
                  <AlertCircle size={48} className="text-red-500 mx-auto mb-6"/>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Protocol Error</h3>
                  <p className="text-slate-500 font-medium">{error}</p>
              </motion.div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => <SkeletonCard key={i}/>)}
            </div>
          ) : filteredPosts.length === 0 ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-white rounded-[3rem] border border-slate-100">
                <Search size={64} className="text-slate-100 mx-auto mb-6"/>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-300">No matching intelligence found</h3>
             </motion.div>
          ) : (
            <motion.div 
              initial="hidden" animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
            {filteredPosts.map((post) => (
            <motion.article 
              key={post.id} 
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full relative"
            >
                <Link to={`/blog/${post.id}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                    <img 
                      src={post.media_url || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000"} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-sm">
                            <Tag size={12} className="text-green-600"/> {post.category || "News"}
                        </span>
                    </div>
                </Link>

                <div className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-green-600" />
                            <span>{new Date(post.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <User size={14} className="text-slate-300"/>
                            <span>Bureau</span>
                        </div>
                    </div>

                    <Link to={`/blog/${post.id}`}>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight group-hover:text-green-600 transition-colors tracking-tighter uppercase">
                            {post.title}
                        </h3>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-3 font-medium">{post.excerpt}</p>

                    <Link to={`/blog/${post.id}`} className="mt-auto inline-flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest group/link">
                        <span>Read Full Dispatch</span> 
                        <ArrowRight size={16} className="text-green-600 group-hover/link:translate-x-2 transition-transform"/>
                    </Link>
                </div>
            </motion.article>
            ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}