import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, 
  FaNewspaper, FaUpload, FaShoppingCart, FaShieldAlt,
  FaSync, FaCheckCircle, FaExclamationTriangle, FaPlus
} from 'react-icons/fa';

// --- ARCHITECT CONFIG: CENTRALIZED SYNC ---
const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true); 
  const [isAuthorized, setIsAuthorized] = useState(false); 

  // COMPREHENSIVE DATA STORE
  const [data, setData] = useState({ services: [], slides: [], posts: [] });
  const [slideForm, setSlideForm] = useState({ file: null, section: 'hero' });
  const [editingService, setEditingService] = useState(null);

  // --- 1. SESSION ARCHITECTURE: STRICT SECURITY ---
  const verifyAccess = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session || session.user.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
      }
      setIsAuthorized(true);
    } catch (err) {
      navigate('/login', { replace: true });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate]);

  useEffect(() => { verifyAccess(); }, [verifyAccess]);

  // --- 2. DATA ORCHESTRATION: PARALLEL SYNC ---
  const syncSystem = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      // Fetch all administrative nodes simultaneously
      const [serRes, sliRes, posRes] = await Promise.all([
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/slides`),
        axios.get(`${API_URL}/posts`)
      ]);

      setData({
        services: serRes.data || [],
        slides: sliRes.data || [],
        posts: posRes.data || []
      });
    } catch (error) {
      console.error("[ARCHITECT MONITOR]: Sync Failed", error);
      notify("System Out of Sync", "error");
    } finally {
      setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => { syncSystem(); }, [syncSystem]);

  // --- 3. UI NOTIFICATION ARCHITECT ---
  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- 4. ACTION CONTROLLERS: ATOMIC UPDATES ---
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
    } catch (err) {
      notify("Update Blocked", "error");
    } finally {
      setLoading(false);
    }
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
      notify("Creative Content Synced");
      setSlideForm({ file: null, section: 'hero' });
      syncSystem();
    } catch (err) { notify("Upload Collision", "error"); }
    finally { setLoading(false); }
  };

  if (isVerifying) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <FaShieldAlt className="text-green-500 text-5xl" />
      </motion.div>
      <p className="text-white mt-8 font-black uppercase tracking-[0.4em] text-[10px]">Verifying Protocol...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-slate-900 selection:bg-green-600 selection:text-white pb-20">
      
      {/* --- COMMAND HEADER --- */}
      <nav className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-xl">
            <FaShieldAlt size={20} />
          </div>
          <div>
            <h1 className="font-black uppercase tracking-tighter text-xl leading-none">REX360 <span className="text-green-600">Admin</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accredited Agent Command</p>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} className="group flex items-center gap-3 px-6 py-3 rounded-full border border-slate-100 hover:bg-red-50 transition-all">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-600">Exit System</span>
          <FaSignOutAlt className="text-slate-300 group-hover:text-red-600" />
        </button>
      </nav>

      {/* --- HUD NOTIFICATIONS --- */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: -100, x: "-50%", opacity: 0 }} 
            animate={{ y: 20, x: "-50%", opacity: 1 }} 
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            className={`fixed top-20 left-1/2 z-[100] px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 font-black text-xs uppercase tracking-widest ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-950 text-white'}`}
          >
            {notification.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle className="text-green-500" />}
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-10 py-16 max-w-7xl">
        
        {/* --- NAVIGATION HUD --- */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          {[
            { id: 'services', icon: FaMoneyBillWave, label: 'Financials' },
            { id: 'content', icon: FaImages, label: 'Creative' },
            { id: 'blog', icon: FaNewspaper, label: 'Editorial' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)} 
              className={`px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center gap-4 ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-2xl scale-105' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
          <button onClick={syncSystem} className="ml-auto w-14 h-14 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 hover:text-green-600 transition-all">
            <FaSync className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid gap-10"
        >
          {/* --- FINANCIALS HUB --- */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-[3.5rem] p-16 shadow-sm border border-slate-100">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-slate-950">Revenue Nodes</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Connected to Paystack Gateway</p>
                </div>
                <div className="px-6 py-2 bg-green-100 text-green-700 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live System
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {data.services.map(s => (
                  <div key={s.id} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-green-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="font-black uppercase text-sm tracking-tight text-slate-800">{s.title}</h3>
                      <FaShoppingCart size={20} className="text-slate-200 group-hover:text-green-500 transition-colors" />
                    </div>

                    {editingService === s.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input id={`p-${s.id}`} defaultValue={s.price} className="bg-white border-2 border-slate-100 p-5 rounded-2xl font-black text-slate-950 focus:border-green-500 outline-none" placeholder="Rate" />
                          <input id={`op-${s.id}`} defaultValue={s.original_price} className="bg-white border-2 border-slate-100 p-5 rounded-2xl font-black text-slate-400 focus:border-green-500 outline-none" placeholder="Strike" />
                        </div>
                        <button 
                          onClick={() => updatePricing(s.id, { 
                            price: document.getElementById(`p-${s.id}`).value, 
                            original_price: document.getElementById(`op-${s.id}`).value 
                          })}
                          className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl"
                        >
                          Commit Update
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-slate-950 tracking-tighter">₦{s.price}</span>
                          {s.original_price && <span className="text-slate-400 line-through text-xs font-bold uppercase tracking-widest mt-1">₦{s.original_price}</span>}
                        </div>
                        <button onClick={() => setEditingService(s.id)} className="px-5 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-green-600 border border-slate-100 hover:bg-green-600 hover:text-white transition-all">
                          Modify
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- ASSET HUB --- */}
          {activeTab === 'content' && (
            <div className="space-y-12">
              <div className="bg-white p-16 rounded-[3.5rem] shadow-sm border border-slate-100">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Visual Infrastructure</h2>
                <div className="grid md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Deployment Zone</label>
                    <select className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-black text-xs uppercase" value={slideForm.section} onChange={(e) => setSlideForm({...slideForm, section: e.target.value})}>
                      <option value="hero">Hero Interface</option>
                      <option value="certificate">Accreditation Cert</option>
                      <option value="agent">Agent Credentials</option>
                    </select>
                  </div>
                  <div className="md:col-span-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Source File</label>
                    <input type="file" onChange={(e) => setSlideForm({...slideForm, file: e.target.files[0]})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[10px] font-bold uppercase" />
                  </div>
                  <div className="md:col-span-2">
                    <button onClick={commitAsset} className="w-full h-[62px] bg-green-600 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-slate-950 transition-all shadow-xl shadow-green-600/20">
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {data.slides.map(img => (
                  <div key={img.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm group relative overflow-hidden">
                    <div className="aspect-square bg-slate-100 rounded-[1.8rem] overflow-hidden mb-4">
                      <img src={img.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{img.section}</span>
                      <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-200 hover:border-green-200 hover:text-green-200 transition-all cursor-pointer">
                  <FaPlus size={30} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-4">New Asset</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;