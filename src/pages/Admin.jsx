import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { 
  FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, 
  FaNewspaper, FaUpload, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; 

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  const [slideFile, setSlideFile] = useState(null);
  const [slideSection, setSlideSection] = useState('hero'); 
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', category: 'Business', media: null });
  const [editingService, setEditingService] = useState(null);

  // --- 1. PRO SECURITY & AUTH CHECK ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
        setIsVerifying(false);
      } else {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => { 
    if (isAuthorized) fetchData(); 
  }, [activeTab, isAuthorized]);

  const getHeaders = async (isFormData = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };
  };

  // --- 2. DATA FETCHING (SYNCED WITH HOMEPAGE) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = { services: 'services', content: 'slides', blog: 'posts' };
      const res = await axios.get(`${API_URL}/${endpoints[activeTab]}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (err) {
      showNotify("Connection Error: Check Backend API", "error");
    }
    setLoading(false);
  };

  const showNotify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- 3. PRO ACTIONS (FIXED DELETE & UPLOAD) ---
  const savePrice = async (id, current, original) => {
    try {
      const headers = await getHeaders();
      await axios.put(`${API_URL}/services/${id}`, { price: current, original_price: original }, headers);
      showNotify("Price Updated Successfully");
      setEditingService(null);
      fetchData();
    } catch (err) { showNotify("Update Failed", "error"); }
  };

  const uploadMedia = async () => {
    if (!slideFile) return showNotify("Please select a file", "error");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', slideSection);
    setLoading(true);
    try {
      const headers = await getHeaders(true);
      await axios.post(`${API_URL}/slides`, formData, headers);
      showNotify("Media Uploaded Successfully");
      setSlideFile(null);
      fetchData();
    } catch (err) { showNotify("Upload Failed", "error"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if (!window.confirm("Permanent Delete? This action cannot be undone.")) return;
    try {
      const headers = await getHeaders();
      await axios.delete(`${API_URL}/${endpoint}/${id}`, headers);
      showNotify("Item Removed Successfully");
      fetchData();
    } catch (err) { showNotify("Delete Failed: Check API", "error"); }
  };

  const publishPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(postForm).forEach(key => formData.append(key, postForm[key]));
    if (postForm.media) formData.append('image', postForm.media);
    setLoading(true);
    try {
      const headers = await getHeaders(true);
      await axios.post(`${API_URL}/posts`, formData, headers);
      showNotify("Blog Post Published!");
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData();
    } catch (err) { showNotify("Post Failed: Verify Database", "error"); }
    setLoading(false);
  };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold">Initializing Secure Session...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-2 rounded-lg font-bold">R360</div>
          <h1 className="text-xl font-bold tracking-tight">Management Console</h1>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
          <FaSignOutAlt /> Exit
        </button>
      </header>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {notification.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* NAVIGATION TABS */}
        <nav className="flex gap-4 mb-10 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'services', label: 'Financials', icon: FaMoneyBillWave },
            { id: 'content', label: 'Visual Media', icon: FaImages },
            { id: 'blog', label: 'Publishing', icon: FaNewspaper }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-md scale-105' : 'text-slate-500 hover:bg-white/50'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </nav>

        {/* FINANCIALS TAB */}
        {activeTab === 'services' && (
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b bg-slate-50/50"><h2 className="font-bold">Service Pricing Architecture</h2></div>
            <div className="grid md:grid-cols-2 gap-6 p-8">
              {services.map(s => (
                <div key={s.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg transition-all">
                  <h3 className="font-bold text-slate-700 mb-4">{s.title}</h3>
                  {editingService === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input id={`p-${s.id}`} defaultValue={s.price} className="border p-3 rounded-xl w-full text-sm" placeholder="Current Price" />
                        <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-3 rounded-xl w-full text-sm" placeholder="Original Price" />
                      </div>
                      <button onClick={() => savePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Update Pricing</button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">{s.price}</span>
                        {s.original_price && <span className="text-slate-400 line-through text-sm">{s.original_price}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(s.id)} className="p-3 bg-white border rounded-xl hover:bg-slate-100"><FaImages className="text-blue-600"/></button>
                        <button onClick={() => deleteItem('services', s.id)} className="p-3 bg-white border rounded-xl hover:bg-red-50"><FaTrash className="text-red-500"/></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VISUAL MEDIA TAB */}
        {activeTab === 'content' && (
          <div className="space-y-10">
            <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="font-bold mb-8">Asset Upload Engine</h2>
              <div className="grid md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Placement</label>
                  <select className="w-full border p-3.5 rounded-xl bg-slate-50" value={slideSection} onChange={(e) => setSlideSection(e.target.value)}>
                    <option value="hero">Primary Slider</option>
                    <option value="certificate">Validation Certificate</option>
                    <option value="agent">Authorized Agent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Source File</label>
                  <input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="w-full border p-2.5 rounded-xl bg-slate-50" />
                </div>
                <button onClick={uploadMedia} disabled={loading} className="bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                  {loading ? 'Processing...' : 'Deploy Asset'}
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {slides.map(img => (
                <div key={img.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="h-40 relative">
                    <img src={img.image_url} className="w-full h-full object-cover" />
                    <button onClick={() => deleteItem('slides', img.id)} className="absolute top-3 right-3 bg-white/90 text-red-600 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white">
                      <FaTrash size={14}/>
                    </button>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{img.section}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* PUBLISHING TAB */}
        {activeTab === 'blog' && (
          <div className="grid lg:grid-cols-12 gap-10">
            <section className="lg:col-span-5 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm h-fit">
              <h2 className="font-bold mb-8">Content Creator</h2>
              <form onSubmit={publishPost} className="space-y-6">
                <input type="text" required className="w-full border p-4 rounded-2xl bg-slate-50" placeholder="Post Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-4 rounded-2xl bg-slate-50 min-h-[150px]" placeholder="Brief Summary" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <select className="border p-4 rounded-2xl bg-slate-50 text-sm font-bold" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
                      <option value="Business">Business</option>
                      <option value="CAC">CAC Updates</option>
                      <option value="News">Corporate News</option>
                   </select>
                   <input type="file" className="border p-3 rounded-2xl bg-slate-50 text-xs" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">Submit to Live Feed</button>
              </form>
            </section>

            <section className="lg:col-span-7 space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center hover:bg-slate-50 transition-all shadow-sm">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">#</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{post.title}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase">{post.category}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('posts', post.id)} className="p-4 bg-white border rounded-2xl hover:bg-red-50 text-red-500 transition-all">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;