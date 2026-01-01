{ useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Printer, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${id}`);
        setPost(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading Official Notice...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Notice not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20 selection:bg-green-100">
      {/* 1. Formal Navigation Bar */}
      <div className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/blog" className="flex items-center gap-2 text-slate-500 hover:text-green-700 font-bold text-sm transition-colors">
            <ArrowLeft size={18} /> BACK TO NEWS
          </Link>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="text-slate-400 hover:text-slate-600"><Printer size={18}/></button>
            <button className="text-slate-400 hover:text-slate-600"><Share2 size={18}/></button>
          </div>
        </div>
      </div>

      {/* 2. Official Header (CAC Style) */}
      <header className="bg-slate-50 pt-16 pb-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={14} /> Official Regulatory Update
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase mb-8">
            {post.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><Calendar size={14} className="text-green-600"/> {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="flex items-center gap-2"><User size={14} className="text-green-600"/> Posted by Management</div>
          </div>
        </div>
      </header>

      {/* 3. Article Content Area */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {post.media_url && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
          >
            {post.media_type === 'video' ? (
              <video src={post.media_url} controls className="w-full h-auto" />
            ) : (
              <img src={post.media_url} className="w-full h-auto object-cover" alt="Featured" />
            )}
          </motion.div>
        )}

        <div className="prose prose-lg max-w-none text-slate-700 leading-loose font-normal">
          {/* Main text content rendered here */}
          <div className="whitespace-pre-wrap">
            {post.excerpt}
            <br /><br />
            {post.content || "Full regulatory details are available for review below. Please contact the REX360 helpdesk for further clarification on this notice."}
          </div>

          {/* 4. The "Official Signature" Block (Critically important for that CAC look) */}
          <div className="mt-20 pt-10 border-t-2 border-slate-100">
             <p className="text-slate-900 font-bold mb-2">Signed:</p>
             <p className="text-green-700 font-black text-2xl uppercase tracking-tighter">Management</p>
             <div className="mt-4 text-slate-400 text-sm italic">
               <p>REX360 SOLUTIONS LTD</p>
               <p>Accredited CAC Registration Agent • RC 142280</p>
               <p>{new Date().getFullYear()} Regulatory Compliance Division</p>
             </div>
          </div>
        </div>
      </article>

      {/* 5. Next Steps Footer */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-bold mb-4">Need help with this update?</h3>
             <p className="text-slate-400 mb-8 max-w-lg mx-auto">Our accredited agents are available 24/7 to help you navigate these new registration requirements.</p>
             <Link to="/services">
               <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition-all">
                 Consult an Agent Now
               </button>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;