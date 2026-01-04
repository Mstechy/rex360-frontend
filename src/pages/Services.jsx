import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Users, Globe, Stamp, FileText, Lock, 
  ChevronRight, CheckCircle2, LockKeyhole, Sparkles, ShieldCheck, History
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const SERVICE_TEMPLATES = [
  {
    id: 'company', 
    title: "Company Registration (Ltd)", 
    price: "₦80,000",
    original_price: "₦100,000",
    Icon: Users, colorClass: "text-blue-600 bg-blue-50",
    desc: "Full Limited Liability Incorporation (1 or more directors).",
    fields: [
      { key: "prop_name1", label: "Company Name Option 1", type: "text", width: "full" },
      { key: "prop_name2", label: "Company Name Option 2", type: "text", width: "full" },
      { key: "biz_email", label: "Business Email", type: "email", width: "half" },
      { key: "biz_phone", label: "Business Phone", type: "tel", width: "half" },
      { key: "biz_address", label: "Business Address (Street, LGA, City, State)", type: "textarea", width: "full" },
      { key: "nature_biz", label: "Objectives / Nature of Business", type: "textarea", width: "full" },
      { key: "share_capital", label: "Share Capital", type: "text", width: "half" },
      { key: "share_allotment", label: "Shareholder Percentage (Allotment)", type: "text", width: "half" },
      { key: "dir_surname", label: "Director Surname", type: "text", width: "half" },
      { key: "dir_firstname", label: "Director First Name", type: "text", width: "half" },
      { key: "dir_middlename", label: "Director Middle Name", type: "text", width: "half" },
      { key: "dir_phone", label: "Director Phone Number", type: "tel", width: "half" },
      { key: "dir_email", label: "Director Email", type: "email", width: "half" },
      { key: "dir_dob", label: "Director Date of Birth", type: "date", width: "half" },
      { key: "dir_sex", label: "Director Sex", type: "select", options: ["Male", "Female"], width: "half" },
      { key: "dir_id_num", label: "Valid ID Number (NIN/DL/Passport)", type: "text", width: "half" },
      { key: "dir_occ", label: "Director Occupation", type: "text", width: "half" },
      { key: "dir_address", label: "Director Home Address (Complete)", type: "textarea", width: "full" },
      { key: "sec_info", label: "Secretary Info (Full Name, Phone, Email, Address, ID)", type: "textarea", width: "full" },
      { key: "wit_surname", label: "Witness Surname", type: "text", width: "half" },
      { key: "wit_firstname", label: "Witness First Name", type: "text", width: "half" },
      { key: "wit_email", label: "Witness Email", type: "email", width: "half" },
      { key: "wit_phone", label: "Witness Phone", type: "tel", width: "half" },
      { key: "wit_address", label: "Witness Full Address", type: "textarea", width: "full" },
      { key: "wit_occ", label: "Witness Occupation", type: "text", width: "full" }
    ]
  },
  {
    id: 'annual-returns', 
    title: "Annual Returns", 
    price: "₦15,000",
    original_price: "₦25,000",
    Icon: History, colorClass: "text-green-600 bg-green-50",
    desc: "Filing for Active Company Status and Compliance.",
    fields: [
      { key: "reg_name", label: "Registered Company Name", type: "text", width: "full" },
      { key: "rc_num", label: "Registration No (RC)", type: "text", width: "half" },
      { key: "comp_email", label: "Company Email", type: "email", width: "half" },
      { key: "biz_address", label: "Current Business Address", type: "textarea", width: "full" },
      { key: "biz_nature", label: "What is the company into?", type: "text", width: "full" },
      { key: "share_cap", label: "Current Share Capital", type: "text", width: "half" },
      { key: "turnover_y1", label: "Turnover (Year 1)", type: "text", width: "half" },
      { key: "turnover_y2", label: "Turnover (Year 2)", type: "text", width: "half" },
      { key: "net_asset", label: "Net Asset Figure", type: "text", width: "half" }
    ]
  },
  {
    id: 'biz-name', 
    title: "Business Name", 
    price: "₦35,000",
    original_price: "₦45,000",
    Icon: Briefcase, colorClass: "text-blue-600 bg-blue-50",
    desc: "Registration of Enterprise/Sole Proprietorship.",
    fields: [
      { key: "prop_name1", label: "Proposed Business Name", type: "text", width: "full" },
      { key: "surname", label: "Surname", type: "text", width: "half" },
      { key: "firstname", label: "First Name", type: "text", width: "half" },
      { key: "othernames", label: "Middle Name", type: "text", width: "half" },
      { key: "dob", label: "Date of Birth", type: "date", width: "half" },
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"], width: "half" },
      { key: "phone", label: "Phone Number", type: "tel", width: "half" },
      { key: "email", label: "Email Address", type: "email", width: "full" },
      { key: "nin", label: "NIN Number", type: "text", width: "full" },
      { key: "res_address", label: "Home Address (Complete)", type: "textarea", width: "full" },
      { key: "nature_biz", label: "Nature of Business", type: "textarea", width: "full" }
    ]
  },
  {
    id: 'ngo', 
    title: "NGO / Church", 
    price: "₦140,000",
    original_price: "₦165,000",
    Icon: Globe, colorClass: "text-purple-600 bg-purple-50",
    desc: "Incorporated Trustees for Non-Profits.", 
    fields: [
      { key: "prop_name1", label: "Proposed NGO Name", type: "text", width: "full" },
      { key: "chair_name", label: "Chairman Full Name", type: "text", width: "full" },
      { key: "sec_name", label: "Secretary Full Name", type: "text", width: "full" },
      { key: "trustees", label: "Trustees Details (Name, NIN, Address)", type: "textarea", width: "full" },
      { key: "ngo_address", label: "NGO Address", type: "textarea", width: "full" },
      { key: "aims", label: "Aims & Objectives", type: "textarea", width: "full" }
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
      { key: "part1_details", label: "Partner 1 (Surname, First Name, Phone, Email, Address, NIN)", type: "textarea", width: "full" },
      { key: "part2_details", label: "Partner 2 (Surname, First Name, Phone, Email, Address, NIN)", type: "textarea", width: "full" },
      { key: "biz_address", label: "Business Address", type: "textarea", width: "full" },
      { key: "nature_biz", label: "Nature of Business", type: "textarea", width: "full" },
      { key: "prop_name1", label: "Proposed Name 1", type: "text", width: "full" }
    ]
  },
  {
    id: 'trademark', 
    title: "Trademark", 
    price: "₦50,000",
    original_price: "₦65,000",
    Icon: Stamp, colorClass: "text-orange-600 bg-orange-50",
    desc: "Brand Name and Logo Protection.", 
    fields: [
      { key: "trademark_name", label: "Proposed Trademark Name", type: "text", width: "full" },
      { key: "app_name", label: "Applicant Full Name", type: "text", width: "full" },
      { key: "app_address", label: "Applicant Address", type: "textarea", width: "full" },
      { key: "class_biz", label: "Class of Business", type: "text", width: "full" }
    ]
  },
  {
    id: 'export', 
    title: "Export License", 
    price: "₦65,000",
    original_price: "₦80,000",
    Icon: FileText, colorClass: "text-teal-600 bg-teal-50",
    desc: "NEPC Certification for Global Trade.",
    fields: [
      { key: "reg_name", label: "Registered Company Name", type: "text", width: "full" },
      { key: "rc_num", label: "RC Number", type: "text", width: "half" },
      { key: "tin", label: "Tax ID (TIN)", type: "text", width: "half" },
      { key: "email", label: "Company Email", type: "email", width: "full" }
    ]
  }
];

export default function Services() {
  const [servicesList, setServicesList] = useState(SERVICE_TEMPLATES);
  const [activeService, setActiveService] = useState(SERVICE_TEMPLATES[0]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceId = params.get('id');
    if (serviceId) {
      const selected = servicesList.find(s => s.id === serviceId);
      if (selected) setActiveService(selected);
    }
  }, [location, servicesList]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const dbPrices = await res.json();
        if (dbPrices.length > 0) {
            const updated = SERVICE_TEMPLATES.map(t => {
                const dbItem = dbPrices.find(p => p.id === t.id); 
                return dbItem ? { 
                    ...t, 
                    price: `₦${dbItem.price.toLocaleString()}`, 
                    original_price: dbItem.original_price ? `₦${dbItem.original_price.toLocaleString()}` : null 
                } : t;
            });
            setServicesList(updated);
        }
      } catch (err) { console.log("System Sync Offline"); }
    };
    fetchPrices();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate('/checkout', { state: { service: activeService, formData: formData } });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* BRANDED HEADER - Navy & Emerald Green */}
      <div className="bg-[#0a192f] border-b border-white/10 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <div className="bg-[#10b981] p-1.5 rounded-lg text-[#0a192f]">
                  <ShieldCheck size={20} />
                </div>
                REX360 <span className="text-[#10b981]">REGISTRY</span>
            </h1>
            <div className="hidden md:flex items-center gap-4">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Accredited Node RC 142280</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
            
            {/* SIDEBAR: ALL 7 SERVICES INTACT */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Filing Catalogue</h3>
                    </div>
                    <div className="max-h-[65vh] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {servicesList.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => { setActiveService(service); setFormData({}); }}
                                className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-500 group relative ${
                                    activeService.id === service.id 
                                    ? 'bg-[#0a192f] text-white shadow-2xl scale-[1.02]' 
                                    : 'hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    activeService.id === service.id 
                                    ? 'bg-[#10b981] text-[#0a192f]' 
                                    : 'bg-slate-100 text-[#0a192f]'
                                }`}>
                                    <service.Icon size={20}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-black text-[11px] uppercase tracking-tight truncate ${activeService.id === service.id ? 'text-white' : 'text-slate-900'}`}>
                                        {service.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-sm font-black ${activeService.id === service.id ? 'text-[#10b981]' : 'text-slate-950'}`}>
                                            {service.price}
                                        </span>
                                        {service.original_price && (
                                            <span className="text-[10px] line-through text-green-400 font-bold opacity-70 decoration-red-500">
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

            {/* MAIN FORM PORTAL */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeService.id}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden"
                    >
                        <div className="bg-[#0a192f] text-white p-10 relative">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/10 rounded-full blur-[100px] -mr-20 -mt-20" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.5em] mb-4 block text-glow">Authorized Form</span>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{activeService.title}</h2>
                                    <p className="text-slate-400 text-sm mt-4 font-medium italic opacity-80">{activeService.desc}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md text-right min-w-[180px]">
                                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Fee</span>
                                    <div className="text-3xl font-black text-white">{activeService.price}</div>
                                    {activeService.original_price && (
                                        <span className="text-xs text-green-400 font-bold line-through opacity-70 decoration-red-500 uppercase tracking-widest">
                                            {activeService.original_price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                {activeService.fields.map((field, i) => (
                                    <div key={i} className={field.width === 'full' ? 'md:col-span-2' : ''}>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block ml-1">
                                            {field.label} <span className="text-[#10b981]">*</span>
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <TextareaAutosize 
                                                minRows={3} required 
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] outline-none transition-all text-sm font-bold text-slate-800"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)} 
                                            />
                                        ) : field.type === 'select' ? (
                                            <select 
                                                required
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] outline-none transition-all text-sm font-bold text-slate-800"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            >
                                                <option value="">Select Option</option>
                                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                required type={field.type} 
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] outline-none transition-all text-sm font-bold text-slate-800"
                                                onChange={(e) => handleInputChange(field.key, e.target.value)} 
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-3">
                                    <Lock size={16} className="text-slate-400"/>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Secure Bureau Encryption<br/>Filing Protocol Active</span>
                                </div>
                                <button type="submit" className="w-full md:w-auto bg-[#10b981] hover:bg-[#0a192f] text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all transform active:scale-95">
                                    Proceed to Checkout
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