import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Printer, ShieldCheck, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchPost = async () => {
      try {
        // We use a clean template literal for the URL to avoid formatting bugs
        const response = await axios.get(`${API_URL}/posts/${id}`);
        if (response.data) {
          setPost(response.data);
        }
      } catch (err) {
        console.error("Pro-Level Debug:", err.response?.status === 404 ? "Post missing in DB" : "Connection Error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Hydration Guard: Prevents Error #418
  if (!isClient) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating Resource...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Notice Not Found</h2>
        <p className="text-slate-500 mb-6">The document ID provided does not exist in our regulatory database.</p>
        <Link to="/blog" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Return to Registry</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-20 selection:bg-green-100"
    >
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-green-700">Home</Link> <ChevronRight size={12} /> 
          <Link to="/blog" className="hover:text-green-700">Press</Link> <ChevronRight size={12} /> 
          <span className="text-slate-900 truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <header className="mb-10">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight uppercase mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-y border-slate-100 py-6">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-green-600"/> 
                    {new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </div> 
                 <div className="flex items-center gap-2">
                    <User size={14} className="text-green-600"/> Verified Management
                 </div>
              </div>
            </header>

            <article className="prose prose-slate lg:prose-xl max-w-none">
              <div className="text-xl font-medium text-slate-600 mb-8 leading-relaxed border-l-4 border-green-600 pl-6 py-2 italic">
                {post.excerpt}
              </div>
              <div className="text-slate-800 leading-loose whitespace-pre-wrap">
                {post.content}
              </div>
            </article>

            <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 font-bold text-xs uppercase mb-4">Official Endorsement</p>
              <p className="text-green-700 font-black text-3xl uppercase tracking-tighter italic">REX360 Solutions</p>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">
                Accredited CAC Agent • RC: 142280 • Corporate Compliance Division
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                <ShieldCheck className="text-green-500 mb-4" size={40} />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Public Verification</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  This notice is an official publication of REX360 Solutions. For legal confirmation, contact our compliance desk.
                </p>
                <Link to="/contact" className="block w-full text-center bg-green-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all">
                  Verify Status
                </Link>
              </div>
              
              <button 
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <Printer size={20} /> Print Document
              </button>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetails;