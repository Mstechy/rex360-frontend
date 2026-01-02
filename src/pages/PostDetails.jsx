import { useEffect, useState } from 'react';
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
        if (res.data) {
          setPost(res.data);
        }
      } catch (err) { 
        console.error("Error fetching post:", err); 
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
          <Link to="/" className="hover:text-green-700">Home</Link> 
          <ChevronRight size={12} /> 
          <Link to="/blog" className="hover:text-green-700">News</Link> 
          <ChevronRight size={12} /> 
          <span className="text-slate-900 truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <header className="mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-y border-slate-100 py-4">
                 <div className="flex items-center gap-2">
                   <Calendar size={14} className="text-green-600"/> 
                   {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </div> 
                 <span>|</span> 
                 <div className="flex items-center gap-2">
                   <User size={14} className="text-green-600"/> 
                   Management
                 </div>
              </div>
            </header>

            {post.media_url && (
              <div className="mb-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                {post.media_type === 'video' ? (
                  <video src={post.media_url} controls className="w-full h-auto" />
                ) : (
                  <img src={post.media_url} className="w-full h-auto object-cover" alt="Notice" />
                )}
              </div>
            )}

            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-normal">
              <div className="whitespace-pre-wrap text-lg italic text-slate-500 mb-8 border-l-4 border-green-600 pl-6">
                {post.excerpt}
              </div>
              <div className="whitespace-pre-wrap">
                {post.content || "Please contact the REX360 helpdesk for further clarification on this notice."}
              </div>

              <div className="mt-20 pt-10 border-t-2 border-slate-100 bg-slate-50 p-8 rounded-2xl">
                 <p className="text-slate-900 font-bold mb-1">Signed:</p>
                 <p className="text-green-700 font-black text-2xl uppercase tracking-tighter">Management</p>
                 <div className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest leading-loose">
                   <p>REX360 SOLUTIONS LTD</p>
                   <p>Accredited CAC Registration Agent • RC 142280</p>
                   <p className="text-slate-400 font-normal">Regulatory Compliance Division • {new Date().getFullYear()}</p>
                 </div>
              </div>
            </div>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <ShieldCheck className="text-green-500 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-4">Regulatory Assistance</h3>
                <p className="text-slate-400 text-sm mb-6">Need priority processing? Consult our accredited agents.</p>
                <Link to="/services" className="block text-center bg-green-600 text-white font-bold py-3 rounded-xl transition-all">Consult Now</Link>
              </div>
              <div className="border border-slate-100 rounded-3xl p-6">
                <button onClick={() => window.print()} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors font-bold text-slate-600">
                    <span>Print Notice</span> <Printer size={18} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;