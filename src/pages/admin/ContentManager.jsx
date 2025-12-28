import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Loader2, Image as ImageIcon, Video, User, FileBadge, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- ✅ I HAVE INSERTED YOUR REAL KEYS CORRECTLY BELOW ---
const SUPABASE_URL = "https://oohabvgbrzrewwrekkfy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function ContentManager() {
  const [activeSection, setActiveSection] = useState('hero'); 
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [uploading, setUploading] = useState(false);

  // 1. Fetch Items
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('section', activeSection)
      .order('created_at', { ascending: false });
      
    if(data) setItems(data);
    if(error) console.error("Database Error:", error);
  };

  useEffect(() => { fetchItems(); }, [activeSection]);

  // 2. Handle File Selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 3. Handle Submit (Upload)
  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const fileType = selectedFile.type.startsWith('video') ? 'video' : 'image';

      // A. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // B. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // C. Save to Database
      const { error: dbError } = await supabase.from('content').insert([{ 
        section: activeSection, 
        image_url: publicUrl, 
        type: fileType,
        title: activeSection === 'profile' ? 'Admin Profile' : '' 
      }]);
      
      if (dbError) throw dbError;

      alert("✅ Upload Successful!");
      setSelectedFile(null); 
      fetchItems(); 

    } catch (error) {
      alert("❌ Upload Failed: " + error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // 4. Delete Logic
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    await supabase.from('content').delete().eq('id', id);
    fetchItems();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold mb-6 text-theme-blue">Content Manager</h2>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {['hero', 'profile', 'certificate'].map((sec) => (
            <button 
                key={sec}
                onClick={() => { setActiveSection(sec); setSelectedFile(null); }} 
                className={`px-4 py-2 rounded-lg font-bold capitalize transition ${
                    activeSection === sec ? 'bg-theme-blue text-white' : 'bg-gray-100 text-gray-500'
                }`}
            >
                {sec === 'hero' ? 'Home Slider' : sec}
            </button>
        ))}
      </div>
      
      {/* UPLOAD AREA */}
      <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* File Input */}
            <div className="flex-1 w-full">
                <input 
                    type="file" 
                    id="file" 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme-blue file:text-white hover:file:bg-theme-blue/90"
                    onChange={handleFileSelect} 
                    accept="image/*,video/*"
                />
            </div>

            {/* Submit Button */}
            <button 
                onClick={handleSubmit}
                disabled={!selectedFile || uploading}
                className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 transition ${
                    !selectedFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-theme-green hover:bg-green-600'
                }`}
            >
                {uploading ? <Loader2 className="animate-spin" size={20}/> : <Upload size={20}/>}
                {uploading ? "Uploading..." : "Upload Now"}
            </button>
        </div>

        {/* Preview Selected File Name */}
        {selectedFile && (
            <div className="mt-3 text-sm text-theme-blue font-medium flex items-center gap-2">
                <CheckCircle size={16} className="text-theme-green"/> 
                Ready to upload: {selectedFile.name}
            </div>
        )}
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border bg-black aspect-square shadow-sm">
                {item.type === 'video' ? (
                    <video src={item.image_url} className="w-full h-full object-cover opacity-80"/>
                ) : (
                    <img src={item.image_url} className="w-full h-full object-cover opacity-80" alt="content"/>
                )}
                
                <div className="absolute top-2 left-2">
                   <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded uppercase font-bold">{item.type}</span>
                </div>

                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600">
                    <Trash2 size={16}/>
                </button>
            </div>
        ))}
        {items.length === 0 && <p className="col-span-4 text-center py-8 text-gray-400 italic bg-gray-50 rounded border border-dashed">No items in this section yet.</p>}
      </div>
    </div>
  );
}