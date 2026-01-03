import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, Lock, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if someone tries to access checkout without choosing a service
  if (!state || !state.service) {
    window.location.href = '/services';
    return null;
  }

  const { service, formData } = state;
  const email = formData.email || formData.dir_email || formData.chair_email || formData.app_email;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/payments/initialize`, {
        email: email,
        amount: service.price, // Our backend will clean the ₦ and commas
        serviceName: service.title,
        metadata: { ...formData, serviceId: service.id }
      });

      if (response.data?.authorization_url) {
        // Store metadata in localStorage to recover if user refreshes after payment
        localStorage.setItem('pending_application', JSON.stringify(formData));
        window.location.href = response.data.authorization_url;
      }
    } catch (err) {
      alert("Payment System Synchronization Error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all mb-8 font-bold uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Edit Details
        </button>

        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* ORDER SUMMARY */}
          <div className="md:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Order <span className="text-slate-300">Summary</span></h2>
              
              <div className="flex items-center justify-between py-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Check size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase text-sm">{service.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">CAC Registration Fee</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">{service.price}</span>
              </div>

              <div className="py-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold">Subtotal</span>
                  <span className="text-slate-900 font-bold">{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold">Service Tax / Processing</span>
                  <span className="text-green-600 font-bold italic">Included</span>
                </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-center">
                <span className="text-xl font-black uppercase tracking-tighter">Total Due</span>
                <span className="text-3xl font-black text-slate-950">{service.price}</span>
              </div>
            </motion.div>
          </div>

          {/* PAYMENT ACTION */}
          <div className="md:col-span-5">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <Lock className="text-green-500 mb-6" size={32} />
                <h3 className="text-xl font-black uppercase tracking-widest mb-4">Secure Checkout</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium mb-10">
                  Transactions are encrypted via Paystack. Your corporate details will be transmitted to the CAC registry upon successful payment.
                </p>

                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-6 bg-green-600 hover:bg-green-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={16}/> Pay Now</>}
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 grayscale invert" alt="Paystack" />
                  <ShieldCheck size={16} />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}