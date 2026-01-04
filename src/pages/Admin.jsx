import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages,
  FaSync, FaShieldAlt, FaUsers, FaHistory, FaUpload, FaCheckCircle, FaVideo, FaEdit, FaChevronRight,
  FaNewspaper, FaLayerGroup, FaTag, FaHome
} from 'react-icons/fa';
import HomepageManager from './admin/HomepageManager';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registry');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [data, setData] = useState({ services: [], slides: [], applications: [], logs: [], posts: [], content: [] });
  const [editingService, setEditingService] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    file: null,
    section: 'hero',
    title1: '',
    title2: '',
    subtitle: '',
    label: 'Official CAC Accredited Agent • RC 142280'
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'CAC News',
    media: null
  });

  const [contentForm, setContentForm] = useState({
    name: '',
    type: 'image',
    category: 'hero',
    media: null
  });

  const verifyAccess = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== ADMIN_EMAIL) {
      navigate('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const syncSystem = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const config = { headers: { Authorization: `Bearer ${session?.access_token}` } };

      const [serRes, sliRes, appRes, logRes, posRes, conRes] = await Promise.all([
        axios.get(`${API_URL}/services`, config),
        axios.get(`${API_URL}/slides`, config),
        axios.get(`${API_URL}/applications`, config),
        axios.get(`${API_URL}/logs`, config),
        axios.get(`${API_URL}/posts`, config),
        axios.get(`${API_URL}/content`, config)
      ]);

      setData({
        services: serRes.data || [],
        slides: sliRes.data || [],
        applications: appRes.data || [],
        logs: logRes.data || [],
        posts: posRes.data || [],
        content: conRes.data || []
      });
    } catch (error) {
      notify("Network Error: Check CORS/Backend", "error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { verifyAccess(); if(isAuthorized) syncSystem(); }, [verifyAccess, isAuthorized, syncSystem]);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const updateService = async (id, payload) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`${API_URL}/services/${id}`, payload, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Service Node Updated");
      setEditingService(null);
      syncSystem();
    } catch (err) { notify("Update failed", "error"); }
    finally { setLoading(false); }
  };
  // --- ADD THIS: EXPRESS TOGGLE FOR RED CROSS LINE PACING ---
  const toggleExpressMode = async (id, currentExpressStatus) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`${API_URL}/applications/${id}/express`, 
        { isExpress: !currentExpressStatus }, 
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      notify(`Speed Protocol: ${!currentExpressStatus ? 'EXPRESS ENABLED' : 'NORMAL PACE'}`);
      syncSystem();
    } catch (err) { notify("Speed update failed", "error"); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status, email, bizName) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`${API_URL}/applications/${id}/status`, { status, email, businessName: bizName }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify(`Workflow updated to ${status}`);
      syncSystem();
    } catch (err) { notify("Status update failed", "error"); }
    finally { setLoading(false); }
  };

  const deleteAsset = async (id) => {
    if(!window.confirm("Permanent Delete?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`${API_URL}/slides/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Asset Purged");
      syncSystem();
    } catch (err) { notify("Delete failed", "error"); }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) return notify("Select media first", "error");
    setLoading(true);
    const formData = new FormData();
    formData.append('media', uploadForm.file);
    formData.append('section', uploadForm.section);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'multipart/form-data' }
      });

      if (uploadForm.section === 'agent') {
        await axios.put(`${API_URL}/agent-profile`, { profile_url: res.data.url, bio: uploadForm.subtitle },
        { headers: { Authorization: `Bearer ${session.access_token}` } });
      } else {
        await axios.post(`${API_URL}/slides`, {
          media_url: res.data.url, media_type: res.data.type, section: uploadForm.section,
          title_part_1: uploadForm.title1, title_part_2: uploadForm.title2,
          subtitle: uploadForm.subtitle, label: uploadForm.label
        }, { headers: { Authorization: `Bearer ${session.access_token}` } });
      }

      notify("Asset Live on Homepage");
      setUploadForm({ file: null, section: 'hero', title1: '', title2: '', subtitle: '', label: 'Official CAC Accredited Agent • RC 142280' });
      syncSystem();
    } catch (err) { notify("Upload Blocked", "error"); }
    finally { setLoading(false); }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return notify("Title and content required", "error");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let media_url = null;
      let media_type = null;

      if (newsForm.media) {
        const formData = new FormData();
        formData.append('media', newsForm.media);
        const uploadRes = await axios.post(`${API_URL}/admin/upload`, formData, {
          headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'multipart/form-data' }
        });
        media_url = uploadRes.data.url;
        media_type = uploadRes.data.type;
      }

      await axios.post(`${API_URL}/posts`, {
        title: newsForm.title,
        content: newsForm.content,
        category: newsForm.category,
        media_url,
        media_type
      }, { headers: { Authorization: `Bearer ${session.access_token}` } });

      notify("News Post Published");
      setNewsForm({ title: '', content: '', category: 'CAC News', media: null });
      syncSystem();
    } catch (err) { notify("Publication failed", "error"); }
    finally { setLoading(false); }
  };

  const handleContentUpload = async () => {
    if (!contentForm.media) return notify("Select media first", "error");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('media', contentForm.media);
      const uploadRes = await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'multipart/form-data' }
      });

      await axios.post(`${API_URL}/content`, {
        name: contentForm.name,
        type: contentForm.type,
        url: uploadRes.data.url,
        category: contentForm.category
      }, { headers: { Authorization: `Bearer ${session.access_token}` } });

      notify("Content Asset Added");
      setContentForm({ name: '', type: 'image', category: 'hero', media: null });
      syncSystem();
    } catch (err) { notify("Upload failed", "error"); }
    finally { setLoading(false); }
  };

  const deletePost = async (id) => {
    if(!window.confirm("Delete this post?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Post Deleted");
      syncSystem();
    } catch (err) { notify("Delete failed", "error"); }
  };

  const deleteContent = async (id) => {
    if(!window.confirm("Delete this asset?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`${API_URL}/content/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Asset Deleted");
      syncSystem();
    } catch (err) { notify("Delete failed", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans antialiased">
      <nav className="bg-white border-b px-10 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-xl"><FaShieldAlt /></div>
          <h1 className="font-black uppercase tracking-tighter text-xl leading-none">REX360 <span className="text-emerald-500">Admin</span></h1>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-all flex items-center gap-2">
          Exit System <FaSignOutAlt size={14}/>
        </button>
      </nav>

      <main className="container mx-auto px-10 py-16 max-w-7xl">
        {/* TABS MENU */}
        <div className="flex flex-wrap gap-4 mb-16">
          {[
            { id: 'homepage', label: 'Homepage', icon: FaHome },
            { id: 'registry', label: 'Registry', icon: FaUsers },
            { id: 'financials', label: 'Financials', icon: FaMoneyBillWave },
            { id: 'assets', label: 'Assets', icon: FaImages },
            { id: 'news', label: 'News', icon: FaNewspaper },
            { id: 'content', label: 'Content', icon: FaLayerGroup },
            { id: 'audit', label: 'Audit', icon: FaHistory }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-xl' : 'bg-white text-slate-400 border'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
          <button onClick={syncSystem} className="ml-auto w-12 h-12 bg-white border rounded-2xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all">
            <FaSync className={loading ? 'animate-spin text-emerald-500' : 'text-slate-400'}/>
          </button>
        </div>

        {/* --- HOMEPAGE: HOMEPAGE MANAGEMENT --- */}
        {activeTab === 'homepage' && (
          <HomepageManager />
        )}

        {/* --- REGISTRY: APPLICATION WORKFLOW --- */}
        {activeTab === 'registry' && (
          <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity Node</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact / Email</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Workflow State</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map(app => (
                  <tr key={app.id} className="border-b hover:bg-slate-50/50 transition-all">
                    <td className="p-8">
                      <p className="font-black text-slate-900 text-sm uppercase">{app.business_name_1}</p>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500">{app.business_type}</span>
                    </td>
                    <td className="p-8">
                      <p className="text-xs font-bold text-slate-600 mb-1">{app.director_name}</p>
                      <p className="text-[10px] font-mono font-bold text-blue-500">{app.director_email}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-3">
                        {/* 1. Status Selector (Matches Tracking.jsx Pipeline) */}
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app.id, e.target.value, app.director_email, app.business_name_1)}
                          className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest outline-none border transition-all ${
                            app.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}
                        >
                          <option value="pending">Availability Search</option>
                          <option value="processing">Documentation & Filing</option>
                          <option value="completed">Final Certification</option>
                        </select>

                        {/* 2. Express Toggle (Triggers Red Cross Line on Frontend) */}
                        <button
                          onClick={() => toggleExpressMode(app.id, app.is_express)}
                          className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${
                            app.is_express ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${app.is_express ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                          {app.is_express ? 'Express Mode: Active' : 'Normal Pace'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- FINANCIALS: EDIT PRICES & TITLES --- */}
        {activeTab === 'financials' && (
          <div className="grid md:grid-cols-2 gap-8 bg-white p-12 rounded-[3rem] border shadow-sm animate-in slide-in-from-bottom-5 duration-500">
            {data.services.map(s => (
              <div key={s.id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group">
                {editingService === s.id ? (
                  <div className="space-y-4">
                    <input id={`name-${s.id}`} defaultValue={s.title} className="w-full p-4 rounded-xl border bg-white font-bold text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <input id={`price-${s.id}`} defaultValue={s.price} className="w-full p-4 rounded-xl border bg-white font-black text-emerald-600" />
                      <input id={`orig-${s.id}`} defaultValue={s.original_price} className="w-full p-4 rounded-xl border bg-white font-black text-slate-400" />
                    </div>
                    <button 
                      onClick={() => updateService(s.id, {
                        title: document.getElementById(`name-${s.id}`).value,
                        price: document.getElementById(`price-${s.id}`).value,
                        original_price: document.getElementById(`orig-${s.id}`).value
                      })}
                      className="w-full bg-slate-950 text-white py-4 rounded-xl font-black uppercase text-[10px]"
                    >Update Node</button>
                    <button onClick={() => setEditingService(null)} className="w-full text-[9px] font-black uppercase text-slate-400">Cancel</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-2">{s.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-slate-950">₦{s.price.toLocaleString()}</span>
                        {s.original_price && <span className="text-xs font-bold text-slate-400 line-through decoration-emerald-500/50">₦{s.original_price.toLocaleString()}</span>}
                      </div>
                    </div>
                    <button onClick={() => setEditingService(s.id)} className="p-4 bg-white border rounded-2xl hover:text-emerald-500 transition-all shadow-sm">
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- ASSETS: DYNAMIC GALLERY --- */}
        {activeTab === 'assets' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="bg-white p-12 rounded-[3rem] border shadow-2xl space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Upload Node</label>
                  <select className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold text-xs" value={uploadForm.section} onChange={(e) => setUploadForm({...uploadForm, section: e.target.value})}>
                    <option value="hero">Hero Replay Slide</option>
                    <option value="agent">Agency Identity</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Media Source</label>
                  <input type="file" onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})} className="w-full p-4 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Label Text</label>
                  <input placeholder="Official CAC..." className="w-full p-5 rounded-2xl bg-slate-50 text-xs font-bold" value={uploadForm.label} onChange={(e) => setUploadForm({...uploadForm, label: e.target.value})} />
                </div>
              </div>
              <button onClick={handleUpload} className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em]">
                {loading ? <FaSync className="animate-spin" /> : "Initiate Sync"}
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {data.slides.map(slide => (
                <div key={slide.id} className="group relative bg-white p-4 rounded-[2.5rem] border shadow-sm">
                  <div className="aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden mb-4">
                    {slide.media_type === 'video' ? <video src={slide.media_url} muted loop autoPlay className="w-full h-full object-cover" /> : <img src={slide.media_url} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                    <span>{slide.section}</span>
                    <button onClick={() => deleteAsset(slide.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                      <FaTrash size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NEWS: EDITORIAL MANAGEMENT --- */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans animate-in fade-in duration-500">
            <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                  <FaNewspaper size={24}/>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Editorial Bureau</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Intelligence Distribution Center</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {data.posts?.length || 0} Dispatches Published
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-10 border-r border-slate-100">
                <form onSubmit={handleNewsSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bulletin Title</label>
                      <input
                        required placeholder="Headline..."
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</label>
                      <select
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all font-bold text-sm"
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
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                      className="w-full p-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 outline-none transition-all h-32 resize-none font-medium text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Featured Evidence (Media)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] h-48 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-white hover:border-green-500 transition-all group">
                      <FaUpload size={32} className="text-slate-300 group-hover:text-green-600 mb-3"/>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Deploy Media Asset</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setNewsForm({...newsForm, media: e.target.files[0]})}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <button disabled={loading} className="w-full bg-green-600 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-green-600/10 flex items-center justify-center gap-4">
                    {loading ? <FaSync className="animate-spin" size={20}/> : <FaUpload size={20}/>}
                    {loading ? "Transmitting..." : "Execute Publication"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-5 p-10 bg-slate-50/50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <FaCheckCircle size={14} className="text-green-500"/> Live Archive
                </h3>
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                  {data.posts?.length > 0 ? data.posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 text-sm uppercase mb-2">{post.title}</h4>
                          <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">{post.category}</span>
                        </div>
                        <button onClick={() => deletePost(post.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                          <FaTrash size={14}/>
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{post.content.substring(0, 100)}...</p>
                      {post.media_url && (
                        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                          {post.media_type === 'video' ? (
                            <video src={post.media_url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={post.media_url} className="w-full h-full object-cover" alt="" />
                          )}
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-3">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-400">
                      <FaNewspaper size={48} className="mx-auto mb-4 opacity-20"/>
                      <p className="text-xs font-black uppercase tracking-widest">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENT: ASSET MANAGEMENT --- */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans animate-in fade-in duration-500">
            <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                  <FaLayerGroup size={24}/>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Asset Infrastructure</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Creative Resource Management</p>
                </div>
              </div>
              <div className="px-5 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FaShieldAlt size={14} className="text-green-500"/> System Online
              </div>
            </div>

            <div className="p-10">
              <div className="flex flex-wrap gap-3 mb-12">
                {[
                  { id: 'hero', label: 'Main Slider', icon: <FaImages size={14}/> },
                  { id: 'profile', label: 'Executive Bio', icon: <FaUsers size={14}/> },
                  { id: 'certificate', label: 'Accreditation', icon: <FaTag size={14}/> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-3 ${
                      'hero' === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
                <button className="ml-auto p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-green-600 transition-all">
                  <FaSync size={18} className={loading ? 'animate-spin' : ''}/>
                </button>
              </div>

              <div className="mb-16 p-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] relative group hover:border-green-500/50 transition-colors">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 w-full relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Source Asset</label>
                    <input
                      type="file"
                      onChange={(e) => setContentForm({...contentForm, media: e.target.files[0]})}
                      className="block w-full text-xs text-slate-500 file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-900 file:text-white hover:file:bg-green-600 file:transition-all cursor-pointer"
                      accept="image/*,video/*"
                    />
                  </div>
                  <button
                    onClick={handleContentUpload}
                    disabled={loading}
                    className="h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white shadow-xl flex items-center gap-4 transition-all disabled:bg-slate-200 disabled:shadow-none bg-green-600 hover:bg-slate-950"
                  >
                    {loading ? <FaSync className="animate-spin" size={18}/> : <FaUpload size={18}/>}
                    {loading ? "Transmitting..." : "Execute Upload"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {data.content?.length > 0 ? data.content.map(asset => (
                  <div key={asset.id} className="group relative bg-white p-4 rounded-[2.5rem] border shadow-sm">
                    <div className="aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden mb-4">
                      {asset.type === 'video' ? (
                        <video src={asset.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={asset.url} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                      <span>{asset.category}</span>
                      <button onClick={() => deleteContent(asset.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                        <FaTrash size={14}/>
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 mt-2">{asset.name}</p>
                  </div>
                )) : (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <FaImages size={48} className="mb-4 opacity-20"/>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory Empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- AUDIT: SECURITY LOGS --- */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {data.logs.map(log => (
              <div key={log.id} className="p-6 bg-white rounded-3xl border flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <span className="text-[9px] font-black px-3 py-1 bg-slate-900 text-white rounded-md tracking-tighter uppercase">{log.action_type}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{log.details}</p>
                    <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">
                      {new Date(log.created_at).toLocaleString()} • {log.admin_email}
                    </p>
                  </div>
                </div>
                <FaCheckCircle className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </main>
      
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl ${notification.type === 'success' ? 'bg-slate-950 text-white shadow-emerald-500/20' : 'bg-red-600 text-white'}`}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;