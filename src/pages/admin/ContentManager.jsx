import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Trash2, Upload, Loader2, Image as ImageIcon, Video, 
  CheckCircle, ShieldCheck, Layers, Layout, Camera, 
  Trash, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- PRO-MEASURE: CONFIGURATION INTEGRITY ---
const SUPABASE_URL = "https://oohabvgbrzrewwrekkfy.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function ContentManager() {
  const [activeSection, setActiveSection] = useState('hero'); 
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. DATA ORCHESTRATION: FETCHING
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section', activeSection)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("[ARCHITECT MONITOR]: Fetch Failed", err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // 2. FILE PIPELINE: VALIDATION
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) return alert("System Limit: Files must be under 25MB");
      setSelectedFile(file);
    }
  };

  // 3. ATOMIC UPLOAD EXECUTION
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${activeSection}_${Date.now()}.${fileExt}`;
      const isVideo = selectedFile.type.startsWith('video');

      // A. Storage Ingress
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, selectedFile, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // B. Public Link Generation
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // C. Database Synchronization
      const { error: dbError } = await supabase.from('content').insert([{ 
        section: activeSection, 
        image_url: publicUrl, 
        type: isVideo ? 'video' : 'image',
        title: `Asset_${activeSection}_${Date.now()}` 
      }]);
      
      if (dbError) throw dbError;

      setSelectedFile(null); 
      fetchItems(); 

    } catch (error) {
      alert(`Handshake Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, path) => {
    if (!window.confirm("Permanent Action: Archive this asset?")) return;
    
    try {
      // 1. Database removal
      await supabase.from('content').delete().eq('id', id);
      // 2. Sync UI
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const tabs = useMemo(() => [
    { id: 'hero', label: 'Main Slider', icon: <Layout size={14}/> },
    { id: 'profile', label: 'Executive Bio', icon: <User size={14}/> },
    { id: 'certificate', label: 'Accreditation', icon: <FileBadge size={14}/> }
  ], []);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans">
      
      {/* HEADER: BRANDING */}
      <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-5">
            <div className="bg-slate-950 p-4 rounded-2xl text-white shadow-lg">
                <Layers size={24}/>
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Asset Infrastructure</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Creative Resource Management</p>
            </div>
        </div>
        <div className="px-5 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500"/> System Online
        </div>
      </div>

      <div className="p-10">
        {/* TABS: ARCHITECTURAL HUD */}
        <div className="flex flex-wrap gap-3 mb-12">
            {tabs.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => { setActiveSection(tab.id); setSelectedFile(null); }} 
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-3 ${
                        activeSection === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
            <button onClick={fetchItems} className="ml-auto p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-green-600 transition-all">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
            </button>
        </div>
        
        {/* INGRESS ZONE (UPLOAD) */}
        <div className="mb-16 p-10 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] relative group hover:border-green-500/50 transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                
                <div className="flex-1 w-full relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Source Asset</label>
                    <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        className="block w-full text-xs text-slate-500 file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-900 file:text-white hover:file:bg-green-600 file:transition-all cursor-pointer"
                        accept="image/*,video/*"
                    />
                </div>

                <button 
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white shadow-xl flex items-center gap-4 transition-all disabled:bg-slate-200 disabled:shadow-none bg-green-600 hover:bg-slate-950"
                >
                    {uploading ? <Loader2 className="animate-spin" size={18}/> : <Upload size={18}/>}
                    {uploading ? "Transmitting..." : "Execute Upload"}
                </button>
            </div>

            <AnimatePresence>
                {selectedFile && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={14}/> Ready for injection: {selectedFile.name}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* REPOSITORY GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
                {items.map((item) => (
                    <motion.div 
                        key={item.id} 
                        layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="relative group rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-900 aspect-square shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                        {item.type === 'video' ? (
                            <video src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"/>
                        ) : (
                            <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="content"/>
                        )}
                        
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/10 backdrop-blur-md text-white text-[9px] px-3 py-1.5 rounded-full uppercase font-black tracking-widest border border-white/20">
                               {item.type === 'video' ? <Video size={10} className="inline mr-1"/> : <ImageIcon size={10} className="inline mr-1"/>}
                               {item.type}
                           </span>
                        </div>

                        <button 
                            onClick={() => handleDelete(item.id)} 
                            className="absolute bottom-4 right-4 bg-red-600 text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-95 translate-y-4 group-hover:translate-y-0"
                        >
                            <Trash size={18}/>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {items.length === 0 && !loading && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    <Camera size={48} className="mb-4 opacity-20"/>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory Empty</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}