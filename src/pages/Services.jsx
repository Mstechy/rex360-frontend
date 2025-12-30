import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  Briefcase, Users, Globe, Stamp, FileText, Lock, 
  ChevronRight, CheckCircle2, LockKeyhole, Sparkles 
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SERVICE_TEMPLATES = [
  {
    id: 'biz-name', 
    title: "Business Name", 
    price: "₦35,000",
    original_price: null, // Added to template
    Icon: Briefcase, colorClass: "text-blue-600 bg-blue-50",
    desc: "Sole Proprietorship / Venture.",
    fields: [
      { key: "surname", label: "Surname", type: "text", width: "half" },
      { key: "firstname", label: "First Name", type: "text", width: "half" },
      { key: "othernames", label: "Other Names", type: "text", width: "half" },
      { key: "dob", label: "Date of Birth", type: "date", width: "half" },
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"], width: "half" },
      { key: "phone", label: "Phone Number", type: "tel", width: "half" },
      { key: "email", label: "Email Address", type: "email", width: "full" },
      { key: "nin", label: "NIN Number", type: "text", width: "full" },
      { key: "res_address", label: "Residential Address", type: "textarea", width: "full" },
      { key: "biz_address", label: "Business Address", type: "textarea", width: "full" },
      { key: "nature_biz", label: "Nature of Business", type: "textarea", width: "full" },
      { key: "prop_name1", label: "Proposed Name 1", type: "text", width: "full" },
      { key: "prop_name2", label: "Proposed Name 2", type: "text", width: "full" }
    ]
  },
  {
    id: 'company', 
    title: "Company (Ltd)", 
    price: "₦80,000",
    original_price: null,
    Icon: Users, colorClass: "text-green-600 bg-green-50",
    desc: "Limited Liability Company (LLC).",
    fields: [
      { key: "dir_surname", label: "Director Surname", type: "text", width: "half" },
      { key: "dir_firstname", label: "Director First Name", type: "text", width: "half" },
      { key: "dir_phone", label: "Director Phone", type: "tel", width: "half" },
      { key: "dir_email", label: "Director Email", type: "email", width: "half" },
      { key: "dir_address", label: "Director Address", type: "textarea", width: "full" },
      { key: "comp_address", label: "Company Address", type: "textarea", width: "full" },
      { key: "prop_name1", label: "Proposed Name 1", type: "text", width: "full" },
      { key: "prop_name2", label: "Proposed Name 2", type: "text", width: "full" },
      { key: "obj_memo", label: "Object of Memorandum", type: "textarea", width: "full" },
      { key: "wit_name", label: "Witness Name", type: "text", width: "half" },
      { key: "wit_phone", label: "Witness Phone", type: "tel", width: "half" }
    ]
  },
  {
    id: 'ngo', 
    title: "NGO / Church", 
    price: "₦140,000",
    original_price: null,
    Icon: Globe, colorClass: "text-purple-600 bg-purple-50",
    desc: "Incorporated Trustees.", 
    fields: [
      { key: "chair_name", label: "Chairman Full Name", type: "text", width: "full" },
      { key: "chair_phone", label: "Chairman Phone", type: "tel", width: "half" },
      { key: "chair_email", label: "Chairman Email", type: "email", width: "half" },
      { key: "sec_name", label: "Secretary Full Name", type: "text", width: "full" },
      { key: "trustee1", label: "Trustee 1 Name", type: "text", width: "full" },
      { key: "trustee2", label: "Trustee 2 Name", type: "text", width: "full" },
      { key: "ngo_address", label: "NGO Address", type: "textarea", width: "full" },
      { key: "aims", label: "Aims & Objectives (List 3)", type: "textarea", width: "full" },
      { key: "prop_name1", label: "Proposed NGO Name 1", type: "text", width: "full" },
      { key: "prop_name2", label: "Proposed NGO Name 2", type: "text", width: "full" }
    ]
  },
  {
    id: 'partnership', 
    title: "Partnership", 
    price: "₦35,000",
    original_price: null,
    Icon: Users, colorClass: "text-indigo-600 bg-indigo-50",
    desc: "Business Name with 2+ Partners.",
    fields: [
      { key: "part1_name", label: "Partner 1 Full Name", type: "text", width: "full" },
      { key: "part1_email", label: "Partner 1 Email", type: "email", width: "half" },
      { key: "part1_phone", label: "Partner 1 Phone", type: "tel", width: "half" },
      { key: "part2_name", label: "Partner 2 Full Name", type: "text", width: "full" },
      { key: "biz_address", label: "Business Address", type: "textarea", width: "full" },
      { key: "nature_biz", label: "Nature of Business", type: "textarea", width: "full" },
      { key: "prop_name1", label: "Proposed Name 1", type: "text", width: "full" },
      { key: "prop_name2", label: "Proposed Name 2", type: "text", width: "full" }
    ]
  },
  {
    id: 'trademark', 
    title: "Trademark", 
    price: "₦50,000",
    original_price: null,
    Icon: Stamp, colorClass: "text-orange-600 bg-orange-50",
    desc: "Protect your Brand.", 
    fields: [
      { key: "app_name", label: "Applicant Full Name", type: "text", width: "full" },
      { key: "phone", label: "Phone Number", type: "tel", width: "half" },
      { key: "email", label: "Email Address", type: "email", width: "half" },
      { key: "app_address", label: "Applicant Address", type: "textarea", width: "full" },
      { key: "trademark_name", label: "Proposed Trademark Name", type: "text", width: "full" },
      { key: "class_biz", label: "Class of Business", type: "text", width: "full" }
    ]
  },
  {
    id: 'export', 
    title: "Export License", 
    price: "₦60,000",
    original_price: null,
    Icon: FileText, colorClass: "text-teal-600 bg-teal-50",
    desc: "NEPC Exporter's Certificate.",
    fields: [
      { key: "reg_name", label: "Registered Company Name", type: "text", width: "full" },
      { key: "rc_num", label: "RC Number", type: "text", width: "half" },
      { key: "tin", label: "Tax ID (TIN)", type: "text", width: "half" },
      { key: "email", label: "Company Email", type: "email", width: "full" },
      { key: "bank_acc", label: "Corporate Bank Account Number", type: "text", width: "full" }
    ]
  },
  {
    id: 'copyright', 
    title: "Copyright", 
    price: "₦70,000",
    original_price: null,
    Icon: Lock, colorClass: "text-red-600 bg-red-50",
    desc: "Intellectual Property Protection.",
    fields: [
      { key: "author_name", label: "Author Full Name", type: "text", width: "full" },
      { key: "author_address", label: "Author Address", type: "textarea", width: "full" },
      { key: "work_title", label: "Work Title", type: "text", width: "full" },
      { key: "work_cat", label: "Category of Work", type: "text", width: "full" },
      { key: "email", label: "Email Address", type: "email", width: "full" }
    ]
  }
];

export default function Services() {
  const [servicesList, setServicesList] = useState(SERVICE_TEMPLATES);
  const [activeService, setActiveService] = useState(SERVICE_TEMPLATES[0]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const dbPrices = await res.json();
        
        if (dbPrices.length > 0) {
            const updated = SERVICE_TEMPLATES.map(t => {
                const dbItem = dbPrices.find(p => p.id === t.id); 
                // Updated to include original_price from database
                return dbItem ? { ...t, price: dbItem.price, original_price: dbItem.original_price } : t;
            });
            setServicesList(updated);
            
            setActiveService(prev => {
                const updatedActive = updated.find(u => u.id === prev.id);
                return updatedActive || prev;
            });
        }
      } catch (err) {
        console.log("Using default prices (Offline or Error)");
      }
    };
    fetchPrices();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const hasEmail = Object.keys(formData).some(k => k.toLowerCase().includes('email'));
    if(!hasEmail) { alert("Please enter an email address so we can contact you."); return; }
    
    navigate('/checkout', { 
        state: { service: activeService, formData: formData } 
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={20} className="text-green-600"/> Registration Portal
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-bold text-slate-800">Step 1:</span> Choose Service
                <ChevronRight size={14}/>
                <span className="font-bold text-slate-800">Step 2:</span> Fill Details
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Services</h3>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {servicesList.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => { setActiveService(service); setFormData({}); }}
                                className={`w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all duration-200 group relative ${
                                    activeService.id === service.id 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'hover:bg-slate-50 text-gray-600'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    activeService.id === service.id 
                                    ? 'bg-white/20 text-white' 
                                    : `${service.colorClass}`
                                }`}>
                                    <service.Icon size={18}/>
                                </div>
                                
                                <div className="flex-1 min-w-0 text-left">
                                    <h4 className={`font-bold text-sm truncate ${activeService.id === service.id ? 'text-white' : 'text-slate-800'}`}>
                                        {service.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${activeService.id === service.id ? 'text-green-400' : 'text-slate-900'}`}>
                                            {service.price}
                                        </span>
                                        {/* Added Sidebar Strikethrough */}
                                        {service.original_price && (
                                            <span className={`text-[10px] line-through ${activeService.id === service.id ? 'text-slate-400' : 'text-gray-400'}`}>
                                                {service.original_price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeService.id}
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative"
                    >
                        <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-green-300 mb-3 border border-white/10">
                                        <CheckCircle2 size={12}/> Verified Service
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold">{activeService.title}</h2>
                                    <p className="text-slate-300 text-sm mt-1">{activeService.desc}</p>
                                </div>
                                <div className="text-right bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm min-w-[140px]">
                                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Fee Total</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-bold text-white">{activeService.price}</span>
                                        {/* Added Main Form Strikethrough */}
                                        {activeService.original_price && (
                                            <span className="text-sm text-slate-400 line-through font-medium">
                                                {activeService.original_price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-8">
                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                                {activeService.fields.map((field, i) => (
                                    <div key={i} className={field.width === 'full' ? 'md:col-span-2' : ''}>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">
                                            {field.label} <span className="text-red-500">*</span>
                                        </label>
                                        
                                        {field.type === 'textarea' ? (
                                            <TextareaAutosize 
                                                minRows={3} required 
                                                placeholder="Type here..."
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-800 resize-none placeholder:text-gray-400"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)} 
                                            />
                                        ) : field.type === 'select' ? (
                                            <div className="relative">
                                                <select 
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-800 appearance-none"
                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                >
                                                    <option value="">Select an option...</option>
                                                    {field.options && field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16}/>
                                            </div>
                                        ) : (
                                            <input 
                                                required type={field.type} 
                                                placeholder="Enter details..."
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-800 placeholder:text-gray-400"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)} 
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <LockKeyhole size={14}/> 
                                    <span>256-bit SSL Secure Encryption</span>
                                </div>
                                <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg shadow-green-600/20 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 group transform active:scale-95">
                                    Proceed to Checkout
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/> 
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}