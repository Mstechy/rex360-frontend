import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle, Clock, ShieldCheck, Landmark, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Tracking = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/track?query=${query}`);
      setData(res.data);
    } catch (err) {
      alert("Application not found. Ensure you are using the correct Email or Reference.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Payment & Review", status: "completed" },
    { label: "CAC Availability Search", status: data?.status === 'pending' ? 'current' : 'completed' },
    { label: "Documentation & Filing", status: data?.status === 'processing' ? 'current' : data?.status === 'completed' ? 'completed' : 'upcoming' },
    { label: "Final Certification", status: data?.status === 'completed' ? 'completed' : 'upcoming' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* --- SECTION 1: THE SEARCH --- */}
        <div className="text-center mb-20">
          <span className="text-green-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Registry Transparency Node</span>
          <h1 className="text-slate-950 mb-8">Filing <span className="font-italic text-slate-400">Status</span> Tracker</h1>
          
          <form onSubmit={handleTrack} className="relative max-w-2xl mx-auto">
            <input 
              className="input-elite pr-44 h-20 shadow-2xl border-slate-100"
              placeholder="ENTER EMAIL OR PAYMENT REF..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="absolute right-3 top-3 bottom-3 px-8 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16}/> : <><Search size={16}/> Sync Data</>}
            </button>
          </form>
        </div>

        {/* --- SECTION 2: THE RESULTS --- */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              
              {/* STATUS CARD */}
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                  <div>
                    <h3 className="text-slate-950 mb-2">{data.business_name_1}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        {data.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">RC INCOMING • PAY-REF: {data.payment_ref?.slice(0,8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <ShieldCheck size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Accredited Agent Filing</span>
                  </div>
                </div>

                {/* VISUAL PIPELINE */}
                <div className="relative flex justify-between items-start">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center relative z-10 w-1/4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${
                        step.status === 'completed' ? 'bg-green-600 border-green-100 text-white' : 
                        step.status === 'current' ? 'bg-white border-green-500 text-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 
                        'bg-white border-slate-50 text-slate-200'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle size={22}/> : <Clock size={22}/>}
                      </div>
                      <p className={`mt-6 text-[10px] font-black uppercase tracking-widest text-center leading-tight max-w-[80px] ${step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-950'}`}>
                        {step.label}
                      </p>
                    </div>
                  ))}
                  <div className="absolute top-7 left-0 right-0 h-[2px] bg-slate-100 -z-0" />
                </div>
              </div>

              {/* ACCREDITATION DISCLOSURE (The Protection Part) */}
              <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 border border-white/5">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle className="text-green-500" size={30}/>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Agent Transparency Notice</h4>
                  <p className="text-slate-400 text-sm leading-relaxed italic">
                    REX360 Solutions is a **Private Accredited Agent (RC 142280)**. We are not the Corporate Affairs Commission. 
                    We manage your filing process for speed and accuracy. Timelines are subject to CAC server response times.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tracking;