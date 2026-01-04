import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages,
  FaSync, FaShieldAlt, FaUsers, FaUpload, FaEdit,
  FaNewspaper, FaPlayCircle
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registry');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState({ services: [], slides: [], applications: [] });
  const [editingService, setEditingService] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const syncSystem = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const config = { headers: { Authorization: `Bearer ${session?.access_token}` } };
      const [serRes, sliRes, appRes] = await Promise.all([
        axios.get(`${API_URL}/services`, config),
        axios.get(`${API_URL}/slides`, config),
        axios.get(`${API_URL}/applications`, config)
      ]);
      setData({ services: serRes.data, slides: sliRes.data, applications: appRes.data });
    } catch (error) {
      notify("Network Error: Check CORS/Backend", "error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { syncSystem(); }, [syncSystem]);

  // --- MASTER UPLOAD HANDLER (Banners, Videos, Agent Pics) ---
  const handleUpload = async (section) => {
    if (!uploadFile) return notify("Select file first", "error");
    setLoading(true);
    const formData = new FormData();
    formData.append('media', uploadFile);
    formData.append('section', section);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      notify(`${section.toUpperCase()} Synchronized`);
      setUploadFile(null);
      syncSystem();
    } catch (err) { notify("Upload Blocked", "error"); }
    finally { setLoading(false); }
  };

  // --- DELETE HANDLER (Purge Assets) ---
  const deleteAsset = async (id) => {
    if(!window.confirm("Purge this asset permanently?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`${API_URL}/slides/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Asset Purged");
      syncSystem();
    } catch (err) { notify("Delete failed", "error"); }
  };

  // --- SERVICE UPDATE (Edit Title, Price, Description) ---
  const updateService = async (id) => {
    const payload = {
      title: document.getElementById(`t-${id}`).value,
      price: document.getElementById(`p-${id}`).value,
      description: document.getElementById(`d-${id}`).value
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`${API_URL}/services/${id}`, payload, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      notify("Service Node Updated");
      setEditingService(null);
      syncSystem();
    } catch (err) { notify("Update failed", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased pb-20">
      <nav className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-slate-900 text-2xl" />
          <h1 className="font-black uppercase tracking-tighter text-lg">REX360 <span className="text-emerald-500">ADMIN</span></h1>
        </div>
        <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all flex items-center gap-2">
          Exit <FaSignOutAlt />
        </button>
      </nav>

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { id: 'registry', label: 'Registry', icon: FaUsers },
            { id: 'services', label: 'Services', icon: FaMoneyBillWave },
            { id: 'media', label: 'Media & Hero', icon: FaImages }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* 1. MEDIA HUB: CONTROL HOMEPAGE VISUALS (Upload/Delete) */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border shadow-xl">
              <h3 className="font-black uppercase text-xs mb-6">Asset Dispatch Center</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <select id="target" className="w-full p-4 rounded-xl bg-slate-50 border-none font-bold text-xs">
                    <option value="hero">Main Hero Banner (Video/Image)</option>
                    <option value="agent">Agent Profile Identity</option>
                    <option value="cert">Certificate Accreditation</option>
                  </select>
                  <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} className="w-full p-3 border-2 border-dashed rounded-xl text-[10px] font-black uppercase" />
                </div>
                <button onClick={() => handleUpload(document.getElementById('target').value)} className="bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all">
                  Execute Upload
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.slides.map(slide => (
                <div key={slide.id} className="relative group bg-white p-3 rounded-2xl border">
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3">
                    {slide.media_url?.includes('.mp4') ? (
                      <video src={slide.media_url} muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={slide.media_url} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] font-black uppercase text-slate-400">{slide.section}</span>
                    <button onClick={() => deleteAsset(slide.id)} className="text-slate-200 hover:text-red-500"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SERVICES: EDIT PRICES & DESCRIPTIONS */}
        {activeTab === 'services' && (
          <div className="grid gap-4">
            {data.services.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                {editingService === s.id ? (
                  <div className="space-y-3">
                    <input id={`t-${s.id}`} defaultValue={s.title} className="w-full p-3 border rounded-lg font-bold" />
                    <input id={`p-${s.id}`} defaultValue={s.price} className="w-full p-3 border rounded-lg font-black text-emerald-600" />
                    <textarea id={`d-${s.id}`} defaultValue={s.description} className="w-full p-3 border rounded-lg text-xs" />
                    <div className="flex gap-2">
                      <button onClick={() => updateService(s.id)} className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-black uppercase text-[10px]">Update Node</button>
                      <button onClick={() => setEditingService(null)} className="flex-1 bg-slate-100 py-3 rounded-lg font-black uppercase text-[10px]">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-[10px] uppercase text-slate-400">{s.title}</h4>
                      <p className="text-xl font-black">₦{Number(s.price).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{s.description}</p>
                    </div>
                    <button onClick={() => setEditingService(s.id)} className="p-3 bg-slate-50 rounded-xl hover:text-emerald-500"><FaEdit /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-white shadow-2xl ${notification.type === 'success' ? 'bg-slate-900' : 'bg-red-600'}`}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;