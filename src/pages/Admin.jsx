import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, FaNewspaper, FaUpload } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true); 
  const [isAuthorized, setIsAuthorized] = useState(false); 

  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  const [slideFile, setSlideFile] = useState(null);
  const [slideSection, setSlideSection] = useState('hero'); 
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', category: 'Business', media: null });
  const [editingService, setEditingService] = useState(null);
  const [apiError, setApiError] = useState(null);

  // --- 1. SESSION VERIFICATION ---
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email === ADMIN_EMAIL) {
          setIsAuthorized(true);
        } else {
          navigate('/login', { replace: true });
        }
        setIsVerifying(false);
      } catch (err) { navigate('/login', { replace: true }); }
    };
    verifyAdminAccess();
  }, [navigate]);

  useEffect(() => { if (isAuthorized) fetchData(); }, [activeTab, isAuthorized]);

  // --- 2. FRESH TOKEN HEADERS (Fixes "Verify Session" error) ---
  const getAuthHeaders = async (isUpload = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    return {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': isUpload ? 'multipart/form-data' : 'application/json'
      }
    };
  };

  async function fetchData() {
    setLoading(true);
    setApiError(null);
    try {
      const endpointMap = { services: 'services', content: 'slides', blog: 'posts' };
      const res = await axios.get(`${API_URL}/${endpointMap[activeTab]}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) { setApiError("Backend Sync Error"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // --- 3. ACTIONS (Strictly matched to server.js) ---
  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders();
      if (!config) throw new Error("Session expired");
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Update Failed: Verify session or database columns"); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile); // Matches backend upload.single('image')
    formData.append('section', slideSection); 
    setLoading(true);
    try {
      const config = await getAuthHeaders(true);
      if (!config) throw new Error("Session expired");
      await axios.post(`${API_URL}/slides`, formData, config);
      notify("Image Uploaded Successfully!"); setSlideFile(null); fetchData();
    } catch (err) { alert("Upload Failed: Verify your session"); }
    setLoading(false);
  };

  // FIX: Dynamic routing to correct 404 errors
  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Permanent Delete? This will remove the item from the homepage.")) return;
    try { 
      const config = await getAuthHeaders();
      if (!config) throw new Error("Session expired");
      const targetMap = { content: 'slides', blog: 'posts', services: 'services' };
      await axios.delete(`${API_URL}/${targetMap[endpoint]}/${id}`, config); 
      notify("Deleted successfully!");
      fetchData(); 
    } catch(err) { alert("Delete failed - Verify your session or check API path"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postForm.title);
    formData.append('excerpt', postForm.excerpt);
    formData.append('category', postForm.category);
    if (postForm.media) formData.append('media', postForm.media); // Matches backend upload.single('media')

    setLoading(true);
    try { 
      const config = await getAuthHeaders(true);
      if (!config) throw new Error("Session expired");
      await axios.post(`${API_URL}/posts`, formData, config); 
      notify("Post Published!"); 
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData(); 
    } catch (err) { alert("Post failed: Verify your session"); }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">🔐 Authenticating Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold tracking-tight">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-all"><FaSignOutAlt /> Logout</button>
      </div>

      {notification && <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-bounce">{notification}</div>}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { id: 'services', icon: FaMoneyBillWave, label: 'Fees & Pricing' },
            { id: 'content', icon: FaImages, label: 'Website Visuals' },
            { id: 'blog', icon: FaNewspaper, label: 'Publishing' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-sm transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'services' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-8">Service Price Management</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="border border-gray-100 p-6 rounded-2xl flex flex-col gap-4 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                  <span className="font-bold text-slate-700">{s.title}</span>
                  {editingService === s.id ? (
                    <div className="space-y-3">
                        <input type="text" id={`p-${s.id}`} defaultValue={s.price} className="border p-3 w-full rounded-xl bg-white" placeholder="Sale Price" />
                        <input type="text" id={`op-${s.id}`} defaultValue={s.original_price} className="border p-3 w-full rounded-xl bg-white" placeholder="Original Price" />
                        <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20">Apply Pricing</button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">{s.price}</span>
                        {s.original_price && <span className="text-gray-400 line-through text-xs font-bold">{s.original_price}</span>}
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setEditingService(s.id)} className="p-3 bg-white border rounded-xl text-blue-600 hover:bg-blue-50">Edit</button>
                         <button onClick={() => deleteItem('services', s.id)} className="p-3 bg-white border rounded-xl text-red-500 hover:bg-red-50"><FaTrash /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-8 flex items-center gap-2"><FaUpload/> Asset Management</h2>
              <div className="grid md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Location</label>
                  <select className="w-full border p-3.5 rounded-xl bg-gray-50 font-bold" value={slideSection} onChange={(e) => setSlideSection(e.target.value)}>
                    <option value="hero">Primary Slider</option>
                    <option value="certificate">Validation Certificate</option>
                    <option value="agent">Authorized Agent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Select Media</label>
                  <input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="w-full border p-2.5 rounded-xl bg-gray-50" />
                </div>
                <button onClick={uploadImage} disabled={loading} className="bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all">Upload Asset</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {slides.map(img => (
                 <div key={img.id} className="group border-0 rounded-[2rem] overflow-hidden relative shadow-sm hover:shadow-xl transition-all bg-white">
                    <img src={img.image_url} className="w-full h-40 object-cover" />
                    <div className="p-4 flex justify-between items-center border-t border-gray-50">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{img.section}</span>
                       <button onClick={() => deleteItem('content', img.id)} className="text-red-500 bg-red-50 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><FaTrash size={14}/></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg font-bold mb-8">Content Creator</h2>
              <form onSubmit={createPost} className="space-y-6">
                <input type="text" required className="w-full border p-4 rounded-2xl bg-gray-50" placeholder="Headline" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-4 rounded-2xl bg-gray-50 h-32" placeholder="Write the excerpt..." value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Image</label>
                       <input type="file" className="w-full border p-2 rounded-xl bg-gray-50 text-xs" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                   </div>
                   <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                       <select className="w-full border p-3 rounded-xl bg-gray-50 text-sm font-bold" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
                          <option value="Business">Business</option>
                          <option value="CAC">CAC News</option>
                          <option value="Updates">Updates</option>
                       </select>
                   </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-lg shadow-slate-900/20">Publish to Website</button>
              </form>
            </div>
            
            <div className="lg:col-span-7 space-y-4">
               <h2 className="text-lg font-bold mb-4 px-2">Live Articles</h2>
               {posts.map(post => (
                 <div key={post.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                          {post.media_url ? <img src={post.media_url} className="w-full h-full object-cover"/> : <FaNewspaper className="text-slate-300"/>}
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 leading-tight mb-1">{post.title}</p>
                          <span className="text-[10px] font-black uppercase text-slate-400">{post.category}</span>
                       </div>
                    </div>
                    <button onClick={() => deleteItem('blog', post.id)} className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;