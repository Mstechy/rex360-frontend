import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import Confetti from 'react-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const reference = searchParams.get('reference'); // Paystack transaction reference

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.1} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center border border-slate-100 relative z-10"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Thank you for choosing <span className="font-bold text-slate-900">REX360 SOLUTIONS</span>. 
          Your registration process has been prioritized.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-dashed border-slate-200 text-left">
          <div className="flex items-center gap-3 mb-4 text-slate-400">
             <ShieldCheck size={18} />
             <span className="text-xs font-bold uppercase tracking-widest">Transaction Details</span>
          </div>
          <p className="text-sm font-medium text-slate-700">Reference: <span className="font-mono text-blue-600">{reference || 'REX-AUTO-GEN'}</span></p>
          <p className="text-sm font-medium text-slate-700 mt-2">Status: <span className="text-green-600 font-bold italic">Verified & Paid</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
           <div className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <Mail className="text-blue-600 mb-3" size={24} />
              <h3 className="font-bold text-slate-900 text-sm">Check Your Email</h3>
              <p className="text-xs text-slate-500 mt-1">Receipt and next steps sent.</p>
           </div>
           <div className="flex flex-col items-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <Download className="text-emerald-600 mb-3" size={24} />
              <h3 className="font-bold text-slate-900 text-sm">Get Started</h3>
              <p className="text-xs text-slate-500 mt-1">Download required forms.</p>
           </div>
        </div>

        <Link to="/">
          <button className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-green-600 transition-all flex items-center gap-3 mx-auto">
            Return to Homepage <ArrowRight size={20}/>
          </button>
        </Link>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -z-0"></div>
    </div>
  );
};

export default PaymentSuccess;