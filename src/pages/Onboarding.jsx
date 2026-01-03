import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Upload, Users, Building, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName1: '', businessName2: '', businessType: '',
    directorName: '', directorPhone: '', address: ''
  });

  const nextStep = () => setStep(s => s + 1);
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Logic to sync with Supabase 'applications' table
      await axios.post(`${API_URL}/applications`, formData);
      setStep(4); // Success Step
    } catch (err) { alert("System Sync Error. Contact Support."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-green-500' : 'bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -20 }} key="step1">
              <span className="text-green-500 font-black text-[10px] uppercase tracking-widest mb-4 block">Step 01: Entity Identification</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">Proposed <span className="text-slate-500">Business Names</span></h2>
              <div className="space-y-6">
                <input 
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                  placeholder="Option 1: Primary Business Name"
                  onChange={(e) => setFormData({...formData, businessName1: e.target.value})}
                />
                <input 
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                  placeholder="Option 2: Alternative Name"
                  onChange={(e) => setFormData({...formData, businessName2: e.target.value})}
                />
                <button onClick={nextStep} className="w-full py-6 bg-green-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-500 transition-all flex items-center justify-center gap-3">
                  Continue to Directors <ArrowRight size={16}/>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step2">
              <span className="text-green-500 font-black text-[10px] uppercase tracking-widest mb-4 block">Step 02: Governance Structure</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">Principal <span className="text-slate-500">Information</span></h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <input className="bg-white/5 border border-white/10 p-6 rounded-2xl outline-none" placeholder="Full Legal Name" />
                    <input className="bg-white/5 border border-white/10 p-6 rounded-2xl outline-none" placeholder="Phone Number" />
                </div>
                <textarea className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none h-32" placeholder="Official Business Address" />
                <button onClick={nextStep} className="w-full py-6 bg-green-600 rounded-2xl font-black uppercase tracking-widest text-xs">Finalize Documents</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step3" className="text-center">
              <ShieldCheck size={80} className="text-green-500 mx-auto mb-8" />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Verification <span className="text-slate-500">& Sync</span></h2>
              <p className="text-slate-400 mb-10 font-medium">By clicking submit, you authorize REX360 Solutions to transmit this data to the CAC Portal for availability search and registration.</p>
              <button onClick={handleSubmit} disabled={loading} className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin"/> : "Execute Filing Application"}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
               <CheckCircle2 size={100} className="text-green-500 mx-auto mb-8" />
               <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Success</h2>
               <p className="text-slate-400 text-xl font-bold italic mb-10">Application Synced with CAC Registry. Check your email for next steps.</p>
               <button onClick={() => window.location.href = '/'} className="px-12 py-5 border border-white/20 rounded-full font-black uppercase text-[10px] tracking-widest">Return to Command Center</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;