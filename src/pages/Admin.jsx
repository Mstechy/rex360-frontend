// Ensure you have react-icons and framer-motion installed
// npm install react-icons framer-motion axios

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, 
  FaNewspaper, FaSync, FaCheckCircle, FaExclamationTriangle, FaPlus, FaShieldAlt, FaShoppingCart
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true); 
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [data, setData] = useState({ services: [], slides: [], posts: [] });
  const [slideForm, setSlideForm] = useState({ file: null, section: 'hero' });
  const [editingService, setEditingService] = useState(null);

  const verifyAccess = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) throw new Error("Unauthorized");
      setIsAuthorized(true);
    } catch (err) {
      navigate('/login', { replace: true });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate]);

  const syncSystem = useCallback(async () => {
    setLoading(true);
    try {
      const [serRes, sliRes, posRes] = await Promise.all([
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/slides`),
        axios.get(`${API_URL}/posts`)
      ]);
      setData({ services: serRes.data || [], slides: sliRes.data || [], posts: posRes.data || [] });
    } catch (error) {
      notify("System Out of Sync", "error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { verifyAccess(); if(isAuthorized) syncSystem(); }, [verifyAccess, isAuthorized, syncSystem]);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };
  // Inside Admin.jsx - Add 'logs' to your tabs
{activeTab === 'logs' && (
  <div className="bg-slate-950 rounded-[3rem] p-12 border border-white/10 shadow-2xl">
    <div className="flex items-center gap-4 mb-12">
      <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
        <FaShieldAlt className="text-green-500" />
      </div>
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Security Audit Trail</h2>
    </div>

    <div className="space-y-4">
      {data.logs?.map((log) => (
        <div key={log.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black px-3 py-1 bg-green-600 text-white rounded-md tracking-widest">
              {log.action_type}
            </span>
            <div>
              <p className="text-white font-bold text-sm">{log.details}</p>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">
                {new Date(log.created_at).toLocaleString()} • {log.admin_email}
              </p>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
      ))}
    </div>
  </div>
)}

  const updatePricing = async (id, payload) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`${API_URL}/services/${id}`, payload, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Financials Updated");
      setEditingService(null);
      syncSystem();
    } catch (err) { notify("Update Blocked", "error"); }
    finally { setLoading(false); }
  };

  const commitAsset = async () => {
    if (!slideForm.file) return notify("No Asset Selected", "error");
    const formData = new FormData();
    formData.append('image', slideForm.file);
    formData.append('section', slideForm.section);

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post(`${API_URL}/slides`, formData, {
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      notify("Asset Synced to Cloud");
      setSlideForm({ file: null, section: 'hero' });
      syncSystem();
    } catch (err) { notify("Upload Collision", "error"); }
    finally { setLoading(false); }
  };

  if (isVerifying) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-[0.5em]">Verifying Security...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <nav className="bg-white border-b px-10 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-xl"><FaShieldAlt /></div>
          <h1 className="font-black uppercase tracking-tighter text-xl leading-none">REX360 <span className="text-green-600">Admin</span></h1>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-all flex items-center gap-2">
          Exit System <FaSignOutAlt />
        </button>
      </nav>

      {/* NOTIFICATIONS */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl bg-slate-950 text-white`}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-10 py-16 max-w-7xl">
        {/* TABS */}
        <div className="flex gap-4 mb-16">
          {[{ id: 'services', label: 'Financials', icon: FaMoneyBillWave }, { id: 'content', label: 'Assets', icon: FaImages }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
              className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-slate-950 text-white' : 'bg-white text-slate-400 border'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
          <button onClick={syncSystem} className="ml-auto w-12 h-12 bg-white border rounded-2xl flex items-center justify-center"><FaSync className={loading ? 'animate-spin' : ''}/></button>
        </div>

        {/* CONTENT */}
        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-8 bg-white p-12 rounded-[3rem] border shadow-sm">
            {data.services.map(s => (
              <div key={s.id} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">{s.title}</h3>
                  <FaShoppingCart className="text-slate-200 group-hover:text-green-500 transition-colors" />
                </div>
                {editingService === s.id ? (
                  <div className="space-y-4">
                    <input id={`p-${s.id}`} defaultValue={s.price} className="w-full p-4 rounded-xl border-2 font-black outline-none focus:border-green-500" />
                    <button onClick={() => updatePricing(s.id, { price: document.getElementById(`p-${s.id}`).value })} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Update Rate</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-slate-950">₦{s.price}</span>
                    <button onClick={() => setEditingService(s.id)} className="text-[10px] font-black uppercase text-green-600 border border-green-600/20 px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-all">Modify</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-10">
            <div className="bg-white p-12 rounded-[3rem] border flex items-center gap-6">
              <select className="flex-1 p-4 rounded-xl bg-slate-50 font-black text-xs uppercase" value={slideForm.section} onChange={(e) => setSlideForm({...slideForm, section: e.target.value})}>
                <option value="hero">Hero Background</option>
                <option value="certificate">Accreditation Card</option>
                <option value="agent">Admin Identity</option>
              </select>
              <input type="file" onChange={(e) => setSlideForm({...slideForm, file: e.target.files[0]})} className="flex-1 p-4 text-[10px] font-black uppercase" />
              <button onClick={commitAsset} className="px-10 py-4 bg-green-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-950 transition-all">Upload</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {data.slides.map(img => (
                <div key={img.id} className="bg-white p-3 rounded-[2rem] border group">
                  <div className="aspect-square bg-slate-100 rounded-[1.5rem] overflow-hidden mb-3"><img src={img.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" /></div>
                  <div className="flex justify-between px-2"><span className="text-[10px] font-black uppercase text-slate-400">{img.section}</span><FaTrash className="text-slate-200 hover:text-red-500 transition-colors cursor-pointer" /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;