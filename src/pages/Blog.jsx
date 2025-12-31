import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, ArrowRight, PlayCircle, 
  Tag, Sparkles, Search, AlertCircle 
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

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm h-full">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-800 animate-pulse"></div>
      <div className="p-8 space-y-4">
        <div className="h-6 w-20 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <header className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold mb-6">
                <Sparkles size={16} className="text-green-500"/> REX360 Intelligence Hub
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold text-blue-950 dark:text-white mb-6 tracking-tight">
                News, Insights & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-700">Expert Tutorials.</span>
            </motion.h1>

            <div className="flex flex-wrap justify-center gap-3 mt-12">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${activeFilter === cat ? 'bg-blue-900 text-white shadow-md scale-105' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 hover:border-blue-300'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        {error && (
            <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100">
                <AlertCircle size={40} className="text-red-500 mx-auto mb-4"/>
                <p className="text-red-700 dark:text-red-400 font-bold">Network Error: {error}</p>
            </div>
        )}

        {loading && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{[1, 2, 3].map(i => <SkeletonCard key={i}/>)}</div>}

        {!loading && !error && filteredPosts.length === 0 && (
             <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-700">
                <Search size={48} className="text-gray-300 mx-auto mb-4"/>
                <h3 className="text-2xl font-serif font-bold text-blue-900 dark:text-white">No articles found</h3>
             </div>
        )}

        {!loading && !error && filteredPosts.length > 0 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {filteredPosts.map((post) => (
            <motion.article key={post.id} variants={cardVariants} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative z-0">
                <Link to={`/blog/${post.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                    {/* Updated to match server.js media_type check */}
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
                    <div className="absolute top-5 left-5">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-blue-900 dark:text-blue-200 text-xs font-bold px-4 py-2 rounded-full uppercase flex items-center gap-2 shadow-sm">
                            <Tag size={12} className="text-green-500"/> {post.category || "News"}
                        </span>
                    </div>
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-5 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-green-500" />
                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recent"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                            <User size={14} className="text-blue-500"/>
                            <span>Admin</span>
                        </div>
                    </div>

                    <Link to={`/blog/${post.id}`}>
                        <h3 className="text-2xl font-serif font-bold text-blue-950 dark:text-white mb-4 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-slate-400 text-[15px] leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>

                    <Link to={`/blog/${post.id}`} className="mt-auto inline-flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-sm">
                        <span>Read Article</span> 
                        <ArrowRight size={16} className="text-blue-700"/>
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