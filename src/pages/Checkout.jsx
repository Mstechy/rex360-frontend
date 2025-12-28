import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Clock, CreditCard, Lock, CheckCircle2, 
  ChevronLeft, Loader2, AlertCircle 
} from 'lucide-react';

// ✅ YOUR KEY IS SET HERE
const PAYSTACK_PUBLIC_KEY = "pk_test_4d1cb29343b530fce9ca00ada7b35f2017fe3a00"; 

const API_URL = "http://localhost:5000/api";
const CONTACT = { whatsappLink: "https://wa.me/2349048349548" };

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from Services page
  const { service, formData } = location.state || {};
  const [loading, setLoading] = useState(false);
  
  // Redirect if no service selected
  useEffect(() => {
    if (!service) navigate('/services');
  }, [service, navigate]);

  // --- 1. COUNTDOWN TIMER ---
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- 2. PAYSTACK SETUP ---
  const cleanPrice = service ? parseInt(service.price.replace(/[^0-9]/g, '')) : 0;
  // Fallback email if user didn't type one
  const userEmail = formData?.["Email Address"] || formData?.["Email"] || "client@rex360.com";

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: cleanPrice * 100, // Kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  // Success Handler
  const onSuccess = (reference) => {
    setLoading(true);
    fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client: userEmail,
            service: service.title,
            amount: cleanPrice,
            status: "Paid"
        })
    })
    .then(() => {
        let message = `*✅ PAYMENT CONFIRMED*\n`;
        message += `*Ref:* ${reference.reference}\n`;
        message += `*Service:* ${service.title}\n`;
        message += `*Amount:* ${service.price}\n\n`;
        window.open(`${CONTACT.whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
        navigate('/'); 
    })
    .catch(err => alert("Payment successful, but database error: " + err.message));
  };

  // Close Handler
  const onClose = () => {
    alert("Payment window closed.");
    setLoading(false);
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayClick = () => {
      // 🛑 DEBUG CHECKS
      if (!PAYSTACK_PUBLIC_KEY) { alert("Error: Paystack Key is missing!"); return; }
      if (cleanPrice <= 0) { alert("Error: Price is invalid (0)"); return; }
      
      // Try to open Paystack
      try {
          initializePayment(onSuccess, onClose);
      } catch (error) {
          alert("Paystack Error: " + error.message);
      }
  };

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8">
        
        {/* LEFT: ORDER SUMMARY */}
        <div className="md:col-span-7 space-y-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-900 font-bold mb-4">
            <ChevronLeft size={20}/> Back to Services
          </button>

          {/* Timer Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 text-orange-800"
          >
            <Clock className="animate-pulse" size={24}/>
            <div>
                <p className="text-xs font-bold uppercase opacity-70">Price Lock Expires In</p>
                <p className="text-xl font-mono font-bold">{formatTime(timeLeft)}</p>
            </div>
          </motion.div>

          {/* Invoice Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-950 mb-6">Order Summary</h2>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className={`p-4 rounded-xl ${service.colorClass} text-white`}>
                    <service.Icon size={32}/>
                </div>
                <div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-gray-500">{service.desc}</p>
                </div>
            </div>
            <div className="space-y-3 mb-8">
                {formData && Object.entries(formData).map(([key, value]) => (
                    value && <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-bold text-gray-800 text-right max-w-[200px] truncate">{value}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-dashed">
                <span className="text-lg font-bold text-gray-600">Total Due</span>
                <span className="text-4xl font-extrabold text-blue-900">{service.price}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: PAYMENT ACTION */}
        <div className="md:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 sticky top-32">
                <div className="text-center mb-8">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <CreditCard size={32}/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
                    <p className="text-gray-500 text-sm">Pay securely via Paystack</p>
                </div>

                <button 
                    onClick={handlePayClick}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin"/> : `Pay ${service.price} Now`}
                </button>
                
                <p className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <Lock size={10}/> 256-bit SSL Encrypted Payment
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}