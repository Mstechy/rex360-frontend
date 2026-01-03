import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, ExternalLink, RefreshCw, 
  CheckCircle, Clock, AlertCircle, Mail, Phone,
  ShieldCheck, Filter, Download, MoreVertical
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const AdminApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // --- DATA SYNC PROTOCOL ---
  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      // Get the session token from local storage (Supabase default)
      const sessionStr = localStorage.getItem('sb-token'); 
      const token = sessionStr ? JSON.parse(sessionStr).access_token : '';

      const res = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApps(res.data || []);
    } catch (err) {
      console.error("[REGISTRY ERROR]: Sync Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  // --- STATUS & EMAIL ENGINE ---
  const handleStatusUpdate = async (appId, newStatus, clientEmail, bizName) => {
    setUpdatingId(appId);
    try {
      const sessionStr = localStorage.getItem('sb-token');
      const token = sessionStr ? JSON.parse(sessionStr).access_token : '';

      await axios.put(`${API_URL}/applications/${appId}/status`, {
        status: newStatus,
        email: clientEmail,
        businessName: bizName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Local state update for instant UI feedback
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      
      if (newStatus === 'completed') {
        alert(`Success: ${bizName} is registered. Completion email sent to ${clientEmail}`);
      }
    } catch (err) {
      alert("Status update failed. Verify Admin permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- UI DYNAMICS ---
  const getStatusStyles = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  const filteredApps = apps.filter(a => {
    const matchesSearch = (a.business_name_1?.toLowerCase().includes(filter.toLowerCase()) || 
                           a.director_name?.toLowerCase().includes(filter.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-[900] uppercase tracking-tighter text-slate-900">Registry <span className="text-slate-300">Command</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Accredited Agent Interface • RC 142280</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 focus:bg-white transition-all font-bold text-sm"
                placeholder="Search Entity or Director..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest outline-none"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={fetchApps} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-8 py-12">
        
        {/* --- STATS SUMMARY --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Total Filings", val: apps.length, icon: <FileText/>, color: "text-slate-900" },
             { label: "Pending Search", val: apps.filter(a => a.status === 'pending').length, icon: <Clock/>, color: "text-amber-500" },
             { label: "Active Processing", val: apps.filter(a => a.status === 'processing').length, icon: <RefreshCw/>, color: "text-blue-500" },
             { label: "CAC Certified", val: apps.filter(a => a.status === 'completed').length, icon: <CheckCircle/>, color: "text-emerald-500" },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className={`mb-4 ${stat.color}`}>{stat.icon}</div>
                <p className="text-3xl font-[900] tracking-tighter text-slate-900">{stat.val}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
             </div>
           ))}
        </div>

        {/* --- REGISTRY TABLE --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proposed Entity Names</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lead Director</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Filing Date</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Workflow Status</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredApps.map((app) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={app.id} 
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="font-[900] text-slate-900 uppercase tracking-tight text-sm">{app.business_name_1}</span>
                          <span className="text-[11px] text-slate-400 font-bold italic mt-0.5">{app.business_name_2 || 'No Secondary Option'}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                            {app.director_name?.charAt(0) || 'D'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{app.director_name}</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{app.director_phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="text-sm font-bold text-slate-500">
                          {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="relative">
                          {updatingId === app.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                              <RefreshCw size={14} className="animate-spin text-slate-900" />
                            </div>
                          )}
                          <select 
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) => handleStatusUpdate(app.id, e.target.value, app.email || app.dir_email, app.business_name_1)}
                            className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] outline-none cursor-pointer transition-all ${getStatusStyles(app.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-green-600 hover:border-green-600/20 transition-all">
                            <Mail size={16} />
                          </button>
                          <button className="p-3 bg-slate-950 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-slate-900/10">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredApps.length === 0 && !loading && (
              <div className="py-32 text-center bg-white">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <FileText size={40} />
                </div>
                <h3 className="text-slate-400 font-black uppercase tracking-widest text-xs">Registry Empty or No Match Found</h3>
                <button onClick={() => {setFilter(''); setStatusFilter('all');}} className="mt-4 text-green-600 font-bold text-xs underline">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminApplications;