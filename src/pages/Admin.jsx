import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, 
  FaSync, FaShieldAlt, FaUsers, FaHistory, FaUpload, FaCheckCircle, FaVideo, FaEdit, FaChevronRight
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registry');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [data, setData] = useState({ services: [], slides: [], applications: [], logs: [] });
  const [editingService, setEditingService] = useState(null);
  
  const [uploadForm, setUploadForm] = useState({ 
    file: null, 
    section: 'hero',
    title1: '', 
    title2: '', 
    subtitle: '', 
    label: 'Official CAC Accredited Agent • RC 142280' 
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

      const [serRes, sliRes, appRes, logRes] = await Promise.all([
        axios.get(`${API_URL}/services`, config),
        axios.get(`${API_URL}/slides`, config),
        axios.get(`${API_URL}/applications`, config),
        axios.get(`${API_URL}/logs`, config)
      ]);

      setData({
        services: serRes.data || [],
        slides: sliRes.data || [],
        applications: appRes.data || [],
        logs: logRes.data || []
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
            { id: 'registry', label: 'Registry', icon: FaUsers },
            { id: 'financials', label: 'Financials', icon: FaMoneyBillWave },
            { id: 'assets', label: 'Assets', icon: FaImages },
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
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value, app.director_email, app.business_name_1)}
                        className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest outline-none border transition-all ${
                          app.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
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