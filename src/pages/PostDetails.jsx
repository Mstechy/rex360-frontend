import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, ArrowLeft, Printer, ShieldCheck, 
  ChevronRight, AlertCircle, RefreshCcw, Share2 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null); // tracking 404 vs 500

  // --- PRO-MEASURE: MEMOIZED FETCHING ---
  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorStatus(null);
    
    try {
      // Strict timeout connection to prevent hanging requests
      const response = await axios.get(`${API_URL}/posts/${id}`, { timeout: 10000 });
      if (response.data) {
        setPost(response.data);
        // SEO Polish: Update Title Tag
        document.title = `${response.data.title} | REX360 Compliance`;
      }
    } catch (err) {
      console.error("[PRO-MONITOR]: Connection Failure", err);
      setErrorStatus(err.response?.status || 500);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsClient(true);
    fetchPost();
    // Cleanup title on unmount
    return () => { document.title = "REX360 SOLUTIONS LTD"; };
  }, [fetchPost]);

  // Hydration Guard (Prevents Error #418)
  if (!isClient) return null;

  // --- STATE 1: LOADING (The "Measured" Spinner) ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Syncing Regulatory Database...
        </p>
      </div>
    );
  }

  // --- STATE 2: ERROR/NOT FOUND (Comprehensive Recovery) ---
  if (errorStatus || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="p-6 bg-red-50 rounded-full mb-6">
          <AlertCircle size={48} className="text-red-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          {errorStatus === 404 ? "Document Not Found" : "Connection Timeout"}
        </h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          The requested compliance notice could not be retrieved from the server. It may have been archived or moved.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate(-1)} className="px-8 py-3 border-2 border-slate-100 rounded-xl font-bold text-slate-600 flex items-center gap-2">
            <ArrowLeft size={18} /> Go Back
          </button>
          <button onClick={fetchPost} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2">
            <RefreshCcw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 3: CONTENT RENDER (The "Flow" Architecture) ---
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen pb-32 selection:bg-green-600 selection:text-white"
    >
      {/* Dynamic Breadcrumbs */}
      <nav className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-green-600 transition-colors">Registry</Link> 
          <ChevronRight size={10} /> 
          <Link to="/blog" className="hover:text-green-600 transition-colors">Bulletins</Link> 
          <ChevronRight size={10} /> 
          <span className="text-slate-900 truncate max-w-[150px] md:max-w-none">{post.title}</span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-16">
          
          {/* PRIMARY CONTENT: 8 COLS */}
          <article className="lg:col-span-8">
            <header className="mb-12">
              <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Official Release
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.95] uppercase tracking-tighter mb-8">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-y border-slate-100 py-6">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-green-600" strokeWidth={3}/> 
                    {new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </div> 
                 <div className="flex items-center gap-2">
                    <User size={14} className="text-green-600" strokeWidth={3}/> REX360 Management
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-green-600" strokeWidth={3}/> Verified Notice
                 </div>
              </div>
            </header>

            <div className="prose prose-slate prose-xl max-w-none">
              {/* Excerpt with flowy styling */}
              <div className="text-2xl font-medium text-slate-500 mb-10 leading-relaxed border-l-4 border-green-600 pl-8 italic bg-slate-50 py-6 rounded-r-3xl">
                {post.excerpt}
              </div>
              
              {/* Main Body with spacing preservation */}
              <div className="text-slate-800 leading-[1.8] whitespace-pre-wrap font-medium">
                {post.content || "Supplementary details for this regulatory notice are currently being processed by the compliance division."}
              </div>
            </div>

            {/* Endorsement Block (Professional Finish) */}
            <div className="mt-20 p-10 bg-slate-950 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full blur-3xl" />
               <p className="text-slate-500 font-black text-xs uppercase tracking-widest mb-4">Certified Endorsement</p>
               <h3 className="text-white font-black text-4xl uppercase tracking-tighter italic mb-2">REX360 Solutions</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">
                  Accredited CAC Registration Agent • RC: 142280 <br />
                  Corporate Affairs Commission Compliance Division
               </p>
            </div>
          </article>

          {/* SIDEBAR: 4 COLS (Measured Utility) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Verification Card */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
                <ShieldCheck className="text-green-600 mb-4" size={32} strokeWidth={2.5} />
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Status: Published</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  This document has been cross-referenced with the CAC database and is cleared for public view.
                </p>
                <Link to="/contact" className="flex items-center justify-center gap-3 w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all shadow-xl shadow-green-600/20">
                  Verify Document <ShieldCheck size={16} />
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-3xl font-bold text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  <Printer size={20} />
                  <span className="text-[10px] uppercase tracking-widest">Print</span>
                </button>
                <button 
                  onClick={() => navigator.share({ title: post.title, url: window.location.href })}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-3xl font-bold text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  <Share2 size={20} />
                  <span className="text-[10px] uppercase tracking-widest">Share</span>
                </button>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;