import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Tag, Share2, Clock, User, 
  ChevronRight, Facebook, Twitter, Linkedin, Copy, AlertCircle
} from 'lucide-react';

// ✅ FIX 1: Dynamic URL for Vercel & Localhost
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Always start at top
    fetch(`${API_BASE}/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Helper for responsive images (Safe Mode)
  const variantUrl = (post, size) => {
    if (!post || !post.media_url) return '';
    // If you implement image resizing backend later, logic goes here.
    // For now, we return the original URL to ensure it always works.
    return post.media_url; 
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- 1. SKELETON LOADING STATE (Dark Mode Ready) ---
  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 pt-40 pb-20 min-h-screen animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-slate-800 w-32 rounded mb-6"></div>
      <div className="h-12 bg-gray-200 dark:bg-slate-800 w-3/4 rounded mb-4"></div>
      <div className="h-12 bg-gray-200 dark:bg-slate-800 w-1/2 rounded mb-8"></div>
      <div className="w-full h-96 bg-gray-200 dark:bg-slate-800 rounded-3xl mb-12"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-800 w-full rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-800 w-full rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-800 w-5/6 rounded"></div>
      </div>
    </div>
  );

  // --- 2. ERROR STATE ---
  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-slate-950">
      <AlertCircle size={48} className="text-gray-300 dark:text-slate-700 mb-4"/>
      <h2 className="text-3xl font-bold text-gray-300 dark:text-slate-600 mb-2">404</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Article not found.</p>
      <Link to="/blog" className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition">
        Back to News
      </Link>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen font-sans selection:bg-green-100 selection:text-green-900 dark:selection:bg-green-900 dark:selection:text-green-100 transition-colors duration-300">
      
      {/* --- PROGRESS BAR --- */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8 font-medium">
            <Link to="/" className="hover:text-blue-900 dark:hover:text-blue-400 transition">Home</Link>
            <ChevronRight size={14}/>
            <Link to="/blog" className="hover:text-blue-900 dark:hover:text-blue-400 transition">Blog</Link>
            <ChevronRight size={14}/>
            <span className="text-gray-800 dark:text-gray-200 line-clamp-1">{post.title}</span>
        </nav>

        {/* HEADER SECTION */}
        <header className="max-w-3xl mx-auto text-center mb-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6"
            >
                <Tag size={12}/> {post.category || 'Update'}
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-serif font-bold text-blue-950 dark:text-white mb-6 leading-tight"
            >
                {post.title}
            </motion.h1>

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400 text-sm border-t border-b border-gray-100 dark:border-slate-800 py-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300 overflow-hidden">
                        <User size={16}/>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-200">Admin Team</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-slate-700"></div>
                <div className="flex items-center gap-2">
                    <Calendar size={16}/>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recent"}</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-slate-700 hidden md:block"></div>
                <div className="flex items-center gap-2 hidden md:flex">
                    <Clock size={16}/>
                    <span>{Math.ceil((post.content?.length || post.excerpt?.length || 500) / 400)} min read</span>
                </div>
            </motion.div>
        </header>

        {/* FEATURED MEDIA (Modern Rounded Card) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl overflow-hidden shadow-2xl mb-16 border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-900"
        >
            {post.media_type === 'video' ? (
              <video src={post.media_url} controls preload="metadata" className="w-full max-h-[600px] object-cover bg-black"/>
            ) : (
              <img
                src={variantUrl(post, 640)}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="w-full max-h-[600px] object-cover"
              />
            )}
        </motion.div>

        {/* CONTENT & SIDEBAR GRID */}
        <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: SOCIAL STICKY (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 flex flex-col gap-4 items-center">
                    <button onClick={handleCopyLink} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition tooltip" title="Copy Link">
                        {copied ? <span className="text-green-500 font-bold text-xs">Copied</span> : <Copy size={18}/>}
                    </button>
                    <div className="w-8 h-px bg-gray-200 dark:bg-slate-800"></div>
                    <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[#1877F2] hover:text-white transition"><Facebook size={18}/></button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition"><Twitter size={18}/></button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[#0A66C2] hover:text-white transition"><Linkedin size={18}/></button>
                </div>
            </div>

            {/* CENTER: ARTICLE CONTENT */}
            <div className="lg:col-span-8 lg:col-start-3">
                <article className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="lead text-xl text-gray-500 dark:text-gray-400 font-medium mb-8 italic border-l-4 border-green-500 pl-4">
                        {post.excerpt}
                    </p>
                    <div className="whitespace-pre-line">
                        {post.content || "Full article content coming soon..."}
                    </div>
                </article>

                {/* BOTTOM SHARE (Mobile) */}
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800 lg:hidden">
                    <p className="font-bold text-gray-900 dark:text-white mb-4 text-center">Share this article</p>
                    <div className="flex justify-center gap-4">
                         <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300">
                            <Copy size={16}/> Copy Link
                         </button>
                         <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"><Facebook size={20}/></button>
                         <button className="p-2 bg-blue-50 dark:bg-blue-900/20 text-sky-500 rounded-lg"><Twitter size={20}/></button>
                    </div>
                </div>
            </div>

        </div>

        {/* FOOTER NAV */}
        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-slate-800 text-center">
             <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-blue-900 dark:hover:text-blue-400 font-bold transition group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Back to All News
             </Link>
        </div>

      </div>
    </div>
  );
}