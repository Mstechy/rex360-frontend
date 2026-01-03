import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Printer, ShieldCheck, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${id}`);
        if (res.data) setPost(res.data);
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Verifying Documents...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center font-bold">Notice not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20 selection:bg-green-100">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-green-700">Home</Link> <ChevronRight size={12} /> 
          <Link to="/blog" className="hover:text-green-700">News</Link> <ChevronRight size={12} /> 
          <span className="text-slate-900 truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase mb-6">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-y border-slate-100 py-4">
                 <div className="flex items-center gap-2"><Calendar size={14} className="text-green-600"/> {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div> 
                 <span>|</span> <div className="flex items-center gap-2"><User size={14} className="text-green-600"/> Management</div>
              </div>
            </header>
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
              <div className="whitespace-pre-wrap text-lg italic text-slate-500 mb-8 border-l-4 border-green-600 pl-6">{post.excerpt}</div>
              <div className="whitespace-pre-wrap">{post.content || "Full regulatory details are available for review. Contact REX360 helpdesk for clarification."}</div>
              <div className="mt-20 pt-10 border-t-2 border-slate-100 bg-slate-50 p-8 rounded-2xl">
                 <p className="text-slate-900 font-bold mb-1">Signed:</p>
                 <p className="text-green-700 font-black text-2xl uppercase tracking-tighter">Management</p>
                 <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">REX360 SOLUTIONS LTD • Accredited CAC Registration Agent • RC 142280</p>
              </div>
            </div>
          </div>
          <aside className="lg:w-1/3 space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <ShieldCheck className="text-green-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-4">Regulatory Assistance</h3>
              <p className="text-slate-400 text-sm mb-6">Need priority processing for this update? Consult our accredited agents.</p>
              <Link to="/services" className="block text-center bg-green-600 text-white font-bold py-3 rounded-xl transition-all hover:bg-green-500">Consult Now</Link>
            </div>
            <button onClick={() => window.print()} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600">
               <span>Print Official Notice</span> <Printer size={18} />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;