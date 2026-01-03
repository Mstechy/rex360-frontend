import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [syncing, setSyncing] = useState(true);
  const reference = searchParams.get('reference'); 

  // --- CRITICAL SYNC: MOVE PENDING DATA TO PERMANENT REGISTRY ---
  useEffect(() => {
    const finalizeRegistration = async () => {
      try {
        const cachedData = localStorage.getItem('pending_application');
        if (cachedData) {
          const formData = JSON.parse(cachedData);
          // Add the payment reference to the record for audit
          const finalRecord = { ...formData, payment_ref: reference, status: 'processing' };
          
          await axios.post(`${API_URL}/applications`, finalRecord);
          
          // Clear cache only after successful database injection
          localStorage.removeItem('pending_application');
        }
      } catch (err) {
        console.error("Registry Sync Failure:", err);
      } finally {
        setSyncing(false);
      }
    };

    finalizeRegistration();

    // Update window size for confetti
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reference]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.1} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center border border-slate-100 relative z-10"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          {syncing ? <Loader2 size={48} className="animate-spin" /> : <CheckCircle size={48} strokeWidth={2.5} />}
        </div>

        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">
          Payment <span className="text-green-600">Verified</span>
        </h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
          {syncing 
            ? "Executing filing application and syncing with registry..." 
            : "Thank you for choosing REX360 SOLUTIONS. Your registration process has been prioritized."}
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-dashed border-slate-200 text-left">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
             <ShieldCheck size={18} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Handshake</span>
          </div>
          <p className="text-sm font-bold text-slate-700">Reference: <span className="font-mono text-blue-600 tracking-tighter">{reference || 'REX-AUTO-GEN'}</span></p>
          <p className="text-sm font-bold text-slate-700 mt-2">Status: <span className="text-green-600 uppercase italic">Paid & Registry-Synched</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
           <div className="flex flex-col items-center p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
              <Mail className="text-blue-600 mb-3" size={24} />
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Digital Receipt</h3>
              <p className="text-[10px] text-slate-500 mt-2 font-bold">Check your email for next steps.</p>
           </div>
           <div className="flex flex-col items-center p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
              <Download className="text-emerald-600 mb-3" size={24} />
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Portal Access</h3>
              <p className="text-[10px] text-slate-500 mt-2 font-bold">Registration forms ready.</p>
           </div>
        </div>

        <Link to="/" className="inline-block">
          <button className="bg-slate-950 text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-green-600 transition-all flex items-center gap-4 mx-auto">
            Return to Command Center <ArrowRight size={18}/>
          </button>
        </Link>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] -z-0"></div>
    </div>
  );
};

export default PaymentSuccess;