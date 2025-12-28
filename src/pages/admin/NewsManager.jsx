import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Loader2, Video, Newspaper, 
  UploadCloud, X, Image as ImageIcon, CheckCircle2 
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";

export default function NewsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', category: 'CAC News', media: null
  });

  // 1. Load Posts
  const fetchPosts = () => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error);
  };

  useEffect(() => { fetchPosts(); }, []);

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, media: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Clear File
  const clearFile = () => {
    setFormData({ ...formData, media: null });
    setPreview(null);
  };

  // 4. Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.media) return alert("Please select an image or video");
    
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('excerpt', formData.excerpt);
    data.append('category', formData.category);
    data.append('media', formData.media);

    try {
      const res = await fetch(`${API_URL}/posts`, { method: 'POST', body: data });
      const result = await res.json();

      if(res.ok) {
        alert("✅ News Posted Successfully!");
        setFormData({ title: '', excerpt: '', category: 'CAC News', media: null });
        setPreview(null);
        fetchPosts(); 
      } else {
        alert("❌ Failed: " + (result.error || "Unknown Error")); 
      }
    } catch (err) {
      alert("❌ Network Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete Logic
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this post?")) return;
    await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="bg-blue-50 p-3 rounded-xl text-theme-blue">
            <Newspaper size={24}/>
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">News & Blog Manager</h2>
            <p className="text-gray-400 text-sm">Create updates for your clients.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: CREATE POST FORM --- */}
        <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                
                {/* Inputs Row */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                        <input 
                            required placeholder="e.g., New CAC Rules 2025" 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-theme-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-theme-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option>CAC News</option>
                            <option>Business Tips</option>
                            <option>Tutorials</option>
                        </select>
                    </div>
                </div>
                
                {/* Excerpt */}
                <div className="mb-6 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Short Summary</label>
                    <textarea 
                        required placeholder="Write a short summary of the update..." 
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-theme-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all h-28 resize-none"
                        value={formData.excerpt}
                        onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    />
                </div>

                {/* --- ANIMATED UPLOAD BOX --- */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Featured Media</label>
                    
                    <AnimatePresence mode="wait">
                        {!preview ? (
                            <motion.label 
                                key="upload"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ scale: 1.01, borderColor: '#10B981', backgroundColor: '#ECFDF5' }}
                                whileTap={{ scale: 0.98 }}
                                className="border-2 border-dashed border-gray-300 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors group"
                            >
                                <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                    <UploadCloud size={28} className="text-gray-400 group-hover:text-green-600"/>
                                </div>
                                <span className="text-sm font-bold text-gray-600">Click to upload Image or Video</span>
                                <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, MP4</span>
                                <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                            </motion.label>
                        ) : (
                            <motion.div 
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative border rounded-2xl overflow-hidden h-64 bg-black flex items-center justify-center group shadow-md"
                            >
                                {formData.media?.type.startsWith('video') ? (
                                    <video src={preview} controls className="h-full w-full object-contain"/>
                                ) : (
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover opacity-90"/>
                                )}
                                
                                {/* Overlay Info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                    <p className="text-xs font-bold truncate">{formData.media.name}</p>
                                </div>

                                {/* Remove Button */}
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={clearFile}
                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition z-10"
                                >
                                    <X size={16}/>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading} 
                    className="w-full bg-theme-green text-white py-4 rounded-xl font-bold hover:bg-green-600 flex items-center justify-center gap-2 transition shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin"/> : <Plus size={20}/>} 
                    {loading ? "Uploading to Server..." : "Publish Post"}
                </motion.button>
            </form>
        </div>

        {/* --- RIGHT: RECENT POSTS LIST --- */}
        <div className="lg:col-span-5">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-full max-h-[700px] overflow-y-auto">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14}/> Recent Updates
                </h3>
                
                <div className="space-y-3">
                    <AnimatePresence>
                        {posts.length === 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm text-center py-10">
                                No posts yet. Create your first one!
                            </motion.p>
                        )}

                        {posts.map(post => (
                            <motion.div 
                                key={post.id} 
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {post.media_type === 'video' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                            <Video size={20} className="text-white"/>
                                        </div>
                                    ) : (
                                        <img src={post.media_url} className="w-full h-full object-cover"/>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{post.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{post.excerpt}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                            {post.category}
                                        </span>
                                        <button 
                                            onClick={() => handleDelete(post.id)} 
                                            className="text-gray-300 hover:text-red-500 transition"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}