import React, { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, DollarSign, TrendingDown, ShieldCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- PRO-MEASURE: UNIFIED API BRIDGE ---
const API_URL = import.meta.env.VITE_API_URL || "https://rex360backend.vercel.app/api";

export default function PriceManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // 1. DATA ORCHESTRATION: FETCHING
  const fetchServices = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await axios.get(`${API_URL}/services`);
      if (res.data) setServices(res.data);
    } catch (err) {
      console.error("[ARCHITECT MONITOR]: Financial Sync Failed", err);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // 2. STATE LOGIC: MULTI-INPUT HANDLING
  const handleChange = (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // 3. ATOMIC UPDATE EXECUTION
  const handleSave = async (service) => {
    setLoading(service.id);
    try {
      // Direct Production Put Request
      await axios.put(`${API_URL}/services/${service.id}`, { 
        price: service.price,
        original_price: service.original_price 
      });
      
      // UX FEEDBACK
      alert(`✅ ${service.title} updated successfully!`);
      fetchServices();
    } catch (err) {
      alert("❌ System Update Failed: Verify Backend Connection");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans">
      
      {/* HEADER: FINANCIAL BRANDING */}
      <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                <DollarSign size={24}/>
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Console</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Global Rate & Pricing Control</p>
            </div>
        </div>
        <button 
          onClick={fetchServices}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-green-600 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="p-10">
        <div className="grid gap-6">
          <AnimatePresence>
            {services.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col lg:flex-row items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-green-500/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all gap-8"
              >
                  
                  {/* SERVICE METADATA */}
                  <div className="flex items-center gap-6 w-full lg:w-1/3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">{service.title}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regulatory SKU: {service.id}</span>
                      </div>
                  </div>

                  {/* PRICING INPUTS (MEASURED) */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-6 w-full lg:w-2/3 justify-end items-center">
                      
                      {/* Original (Strike) Price */}
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Original Rate</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₦</span>
                          <input 
                              type="text" 
                              value={service.original_price || ''}
                              onChange={(e) => handleChange(service.id, 'original_price', e.target.value)}
                              placeholder="e.g. 25,000"
                              className="pl-8 pr-4 py-4 rounded-xl border border-slate-100 bg-slate-50/50 w-full sm:w-36 font-mono font-bold text-slate-400 text-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <TrendingDown className="hidden lg:block text-slate-100" />

                      {/* Live (Sale) Price */}
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-[9px] font-black text-green-600 uppercase tracking-widest ml-1">Sale Rate (Live)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">₦</span>
                          <input 
                              type="text" 
                              value={service.price}
                              onChange={(e) => handleChange(service.id, 'price', e.target.value)}
                              className="pl-8 pr-4 py-4 rounded-xl border border-slate-100 bg-white w-full sm:w-44 font-mono font-black text-slate-900 text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <button 
                          onClick={() => handleSave(service)} 
                          disabled={loading === service.id}
                          className="w-full sm:w-auto mt-4 sm:mt-0 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-green-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-200"
                      >
                          {loading === service.id ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                          {loading === service.id ? "Syncing..." : "Update"}
                      </button>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {services.length === 0 && !syncing && (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Financial Nodes Offline</p>
          </div>
        )}
      </div>
    </div>
  );
}