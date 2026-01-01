import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, PlayCircle, Tag, Sparkles, Search, AlertCircle, ShieldCheck } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://rex360backend.vercel.app/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/posts`);
        if (!response.ok) throw new Error("Connection failed");
        const data = await response.json();
        setPosts(data); setFilteredPosts(data);
      } catch (err) { setError(err.message); }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setFilteredPosts(activeFilter === 'All' ? posts : posts.filter(p => p.category === activeFilter));
  }, [activeFilter, posts]);

  const categories = ['All', ...new Set(posts.map(p => p.category || 'News'))];

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      <header className="pt-32 pb-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-100">
                <ShieldCheck size={14}/> Accredited Regulatory Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 uppercase leading-tight tracking-tighter">
                Press Releases & <span className="text-green-600">Public Notices</span>
            </h1>
            <div className="flex flex-wrap gap-2 mt-10">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-gray-200 hover:border-green-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
                <article key={post.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                    <Link to={`/blog/${post.id}`} className="block relative aspect-video overflow-hidden">
                        {post.media_type === 'video' ? <div className="relative w-full h-full bg-black"><PlayCircle size={48} className="absolute inset-0 m-auto text-white opacity-80" /></div> : <img src={post.media_url} className="w-full h-full object-cover group-hover:scale-105 transition-all" alt={post.title} />}
                        <div className="absolute top-4 left-4 bg-green-700 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter">{post.category || "Notice"}</div>
                    </Link>
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">
                            <Calendar size={12} className="text-green-600" /> {new Date(post.created_at).toLocaleDateString()} | <span className="text-green-700">Management</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-4 uppercase group-hover:text-green-700 transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
                        <Link to={`/blog/${post.id}`} className="mt-auto inline-flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest hover:underline">Read More <ArrowRight size={14} /></Link>
                    </div>
                </article>
            ))}
        </motion.div>
      </section>
    </div>
  );
}