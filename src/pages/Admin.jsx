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

  // 🔒 Security: Strictly your logic
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

  // 🔑 Fix: Security Key for all Uploads/Deletes
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { headers: { 'Authorization': `Bearer ${session?.access_token}` } };
  };

  async function fetchData() {
    setLoading(true);
    try {
      const endpoint = activeTab === 'content' ? 'slides' : activeTab;
      const res = await axios.get(`${API_URL}/${endpoint}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) { setApiError("Sync error with backend"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // 🛠️ Professional Fix: Service Update
  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders();
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Update failed - Column 'original_price' may be missing in Supabase"); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', slideSection);
    setLoading(true);
    try {
      const config = await getAuthHeaders();
      await axios.post(`${API_URL}/slides`, formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });
      notify("Uploaded!"); setSlideFile(null); fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  // 🛠️ Professional Fix: Delete Logic for All Tabs
  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Remove this from your website?")) return;
    try { 
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${endpoint}/${id}`, config); 
      fetchData(); 
    } catch(err) { alert("Delete failed - Check API"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postForm.title);
    formData.append('excerpt', postForm.excerpt);
    formData.append('category', postForm.category);
    if (postForm.media) formData.append('image', postForm.media); // Added Image Field

    setLoading(true);
    try { 
      const config = await getAuthHeaders();
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      }); 
      notify("Post Published!"); fetchData(); 
    } catch (err) { alert("Post failed"); }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center">🔐 Verifying Access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2 text-sm"><FaSignOutAlt /> Logout</button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Strictly your Tab structure */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'services', icon: FaMoneyBillWave, label: 'Prices & Services' },
            { id: 'content', icon: FaImages, label: 'Website Images' },
            { id: 'blog', icon: FaNewspaper, label: 'News & Blog' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 shadow-sm border'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Services Tab: View + Edit + Delete */}
        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border flex flex-col justify-between">
                <div>
                  <p className="font-bold text-gray-800">{s.title}</p>
                  {editingService === s.id ? (
                    <div className="mt-2 space-y-2">
                      <input id={`p-${s.id}`} defaultValue={s.price} className="border p-1 w-full rounded" placeholder="Price" />
                      <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-1 w-full rounded" placeholder="Old Price" />
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="w-full bg-green-600 text-white rounded py-1">Save</button>
                    </div>
                  ) : (
                    <div className="mt-2">
                       <span className="font-bold text-green-700">{s.price}</span>
                       {s.original_price && <span className="ml-2 text-gray-400 line-through text-xs">{s.original_price}</span>}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-4 border-t pt-2">
                  <button onClick={() => setEditingService(s.id)} className="text-blue-500 text-xs font-bold">EDIT</button>
                  <button onClick={() => deleteItem('services', s.id)} className="text-red-500"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Images Tab: Upload + Mirror List */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4 flex items-center gap-2"><FaUpload/> Upload Manager</h2>
              <div className="flex flex-wrap gap-4 items-end">
                <select className="border p-2 rounded" value={slideSection} onChange={(e) => setSlideSection(e.target.value)}>
                  <option value="hero">Home Slider</option>
                  <option value="certificate">Certificate</option>
                  <option value="agent">Agent Picture</option>
                </select>
                <input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="border p-1 rounded" />
                <button onClick={uploadImage} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Upload</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slides.map(img => (
                <div key={img.id} className="border rounded-lg overflow-hidden relative group">
                  <img src={img.image_url} className="w-full h-24 object-cover" />
                  <div className="p-2 flex justify-between items-center bg-gray-50">
                    <span className="text-[10px] font-bold uppercase text-blue-600">{img.section}</span>
                    <button onClick={() => deleteItem('slides', img.id)} className="text-red-500"><FaTrash size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Blog Tab: Post + List */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Create Blog Post</h2>
              <form onSubmit={createPost} className="space-y-4">
                <input type="text" required placeholder="Title" className="w-full border p-2 rounded" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required placeholder="Excerpt" className="w-full border p-2 rounded" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <input type="file" className="w-full border p-1 rounded" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded font-bold">Publish</button>
              </form>
            </div>
            <div className="space-y-2">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-4 border rounded-lg flex justify-between items-center">
                  <span className="font-bold text-sm">{post.title}</span>
                  <button onClick={() => deleteItem('posts', post.id)} className="text-red-500"><FaTrash /></button>
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