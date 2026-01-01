import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, ArrowRight, PlayCircle, 
  Tag, Sparkles, Search, AlertCircle, ShieldCheck, Newspaper
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://rex360backend.vercel.app/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/posts`);
        if (!response.ok) throw new Error("Could not connect to REX360 server");
        const data = await response.json();
        
        if (Array.isArray(data)) {
            setPosts(data);
            setFilteredPosts(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === activeFilter));
    }
  }, [activeFilter, posts]);

  const categories = ['All', ...new Set(posts.map(p => p.category || 'News'))];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* 1. Official Commission Header Style */}
      <header className="pt-32 pb-20 px-6 relative bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-100 dark:border-green-800">
                <ShieldCheck size={14}/> Accredited Regulatory Hub
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 uppercase leading-tight tracking-tighter">
                Press Releases & <br/><span className="text-green-600">Public Notices</span>
            </motion.h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium leading-relaxed mb-10">
                Official updates on corporate registration, compliance deadlines, and the Nigerian MSME regulatory environment.
            </p>

            {/* Category Filter - Professional Style */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-green-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        {error && (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100">
                <AlertCircle size={40} className="text-red-500 mx-auto mb-4"/>
                <p className="text-red-700 dark:text-red-400 font-bold">Network Error: {error}</p>
            </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
             <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-700">
                <Search size={48} className="text-gray-300 mx-auto mb-4"/>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-white">No articles found</h3>
             </div>
        )}

        {/* 2. Content Feed - CAC Grid Style */}
        {!loading && !error && filteredPosts.length > 0 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {filteredPosts.map((post) => (
            <motion.article key={post.id} variants={cardVariants} className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                
                {/* Image Section */}
                <Link to={`/blog/${post.id}`} className="block relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800">
                    {post.media_type === 'video' ? (
                        <div className="relative w-full h-full">
                            <video src={post.media_url} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle size={48} className="text-white opacity-80" />
                            </div>
                        </div>
                    ) : (
                        <img src={post.media_url || "https://via.placeholder.com/600x400"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-green-700 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter">
                            {post.category || "Notice"}
                        </span>
                    </div>
                </Link>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">
                        <Calendar size={12} className="text-green-600" />
                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Recent"}</span>
                        <span>|</span>
                        <span className="text-green-700">Management</span>
                    </div>

                    <Link to={`/blog/${post.id}`}>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 leading-snug uppercase group-hover:text-green-700 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                    </Link>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 font-normal">{post.excerpt}</p>

                    <Link to={`/blog/${post.id}`} className="mt-auto inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-black text-xs uppercase tracking-widest hover:underline">
                        <span>Read More</span> 
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.article>
            ))}
            </motion.div>
        )}
      </section>
    </div>
  );
}