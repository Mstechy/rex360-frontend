import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Loader2, Video, Newspaper, 
  UploadCloud, X, Image as ImageIcon, CheckCircle2,
  AlertCircle, FileText, Globe
} from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabase';

// --- PRO-MEASURE: UNIFIED API BRIDGE ---
const API_URL = import.meta.env.VITE_API_URL || "https://rex360backend.vercel.app/api";

export default function NewsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', category: 'CAC News', media: null
  });

  // 1. DATA ORCHESTRATION: FETCHING
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data || []);
    } catch (err) {
      console.error("[ARCHITECT MONITOR]: News Fetch Failed", err);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // 2. MEDIA HANDLING: PREVIEW ARCHITECT
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) return alert("File exceeds 50MB limit");
      setFormData({ ...formData, media: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setFormData({ ...formData, media: null });
    setPreview(null);
  };

  // 3. EXECUTION LOGIC: SECURE PUBLISHING
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.media) return alert("Editorial requirement: Please attach featured media.");
    
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('excerpt', formData.excerpt);
    data.append('category', formData.category);
    data.append('media', formData.media);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await axios.post(`${API_URL}/posts`, data, {
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      if(res.status === 200 || res.status === 201) {
        setFormData({ title: '', excerpt: '', category: 'CAC News', media: null });
        setPreview(null);
        fetchPosts(); 
      }
    } catch (err) {
      alert("System Collision: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Archive this intelligence from public view?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      fetchPosts();
    } catch (err) { alert("Deletion Blocked"); }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans">
      
      {/* HEADER: EDITORIAL BRANDING */}
      <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                <Newspaper size={24}/>
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Editorial Bureau</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Intelligence Distribution Center</p>
            </div>
        </div>
        <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {posts.length} Dispatches Published
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-0">
        
        {/* --- LEFT: ARCHITECTURAL COMPOSITION --- */}
        <div className="lg:col-span-7 p-10 border-r border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bulletin Title</label>
                        <input 
                            required placeholder="Headline..." 
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-sm"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</label>
                        <select 
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-sm"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option>CAC News</option>
                            <option>Business Tips</option>
                            <option>Regulatory Tutorials</option>
                        </select>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Executive Summary</label>
                    <textarea 
                        required placeholder="Condensed overview for the public feed..." 
                        className="w-full p-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all h-32 resize-none font-medium text-sm leading-relaxed"
                        value={formData.excerpt}
                        onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured Evidence (Media)</label>
                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.label 
                                key="upload"
                                whileHover={{ scale: 1.01 }}
                                className="border-2 border-dashed border-slate-200 rounded-[2rem] h-48 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-white hover:border-green-500 transition-all group"
                            >
                                <UploadCloud size={32} className="text-slate-300 group-hover:text-green-600 mb-3 transition-colors"/>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Deploy Media Asset</span>
                                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                            </motion.label>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-[2rem] overflow-hidden h-64 bg-slate-900 shadow-2xl group">
                                {formData.media?.type.startsWith('video') ? (
                                    <video src={preview} controls className="h-full w-full object-contain"/>
                                ) : (
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover"/>
                                )}
                                <button onClick={clearFile} className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
                                    <X size={16}/>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button disabled={loading} className="w-full bg-green-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-green-600/10 flex items-center justify-center gap-4">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : <Globe size={20}/>} 
                    {loading ? "Transmitting..." : "Execute Publication"}
                </button>
            </form>
        </div>

        {/* --- RIGHT: THE ARCHIVE FEED --- */}
        <div className="lg:col-span-5 p-10 bg-slate-50/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <CheckCircle2 size={14} className="text-green-500"/> Live Archive
            </h3>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {posts.map(post => (
                    <motion.div key={post.id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm group hover:shadow-md transition-all">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                            {post.media_type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-white"><Video size={20}/></div>
                            ) : (
                                <img src={post.media_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">{post.title}</h4>
                                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">{post.category}</span>
                            </div>
                            <button onClick={() => handleDelete(post.id)} className="w-fit text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}