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

  // FIX: This ensures every Delete/Upload has the correct security key
  const getAuthHeaders = async (isUpload = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': isUpload ? 'multipart/form-data' : 'application/json'
      }
    };
  };

  async function fetchData() {
    setLoading(true);
    try {
      const endpoint = activeTab === 'content' ? 'slides' : (activeTab === 'blog' ? 'posts' : 'services');
      const res = await axios.get(`${API_URL}/${endpoint}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) { setApiError("Backend Sync Error"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // UPDATE: Now sends current and strikethrough price
  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders();
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Save failed: Check database columns"); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile); // Key matches your server.js
    formData.append('section', slideSection); 
    setLoading(true);
    try {
      const config = await getAuthHeaders(true);
      await axios.post(`${API_URL}/slides`, formData, config);
      notify("Image Uploaded!"); setSlideFile(null); fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  // FIX: Added dynamic routing and headers for Delete
  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Are you sure?")) return;
    try { 
      const config = await getAuthHeaders();
      const target = endpoint === 'content' ? 'slides' : (endpoint === 'blog' ? 'posts' : 'services');
      await axios.delete(`${API_URL}/${target}/${id}`, config); 
      fetchData(); 
    } catch(err) { alert("Delete failed - Verify your session"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postForm.title);
    formData.append('excerpt', postForm.excerpt);
    formData.append('category', postForm.category);
    if (postForm.media) formData.append('media', postForm.media); // Key matches your server.js

    setLoading(true);
    try { 
      const config = await getAuthHeaders(true);
      await axios.post(`${API_URL}/posts`, formData, config); 
      notify("Post Published!"); 
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData(); 
    } catch (err) { alert("Post failed"); }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">🔐 Verifying Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2 text-sm"><FaSignOutAlt /> Logout</button>
      </div>

      {notification && <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">{notification}</div>}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

        {activeTab === 'services' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Service Price List</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="border p-4 rounded-xl flex flex-col gap-3 bg-gray-50">
                  <span className="font-bold text-gray-700">{s.title}</span>
                  {editingService === s.id ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input type="text" id={`p-${s.id}`} defaultValue={s.price} className="border p-2 w-full rounded" />
                        <input type="text" id={`op-${s.id}`} defaultValue={s.original_price} className="border p-2 w-full rounded" placeholder="Strike Price" />
                      </div>
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="bg-green-600 text-white py-2 rounded font-bold">Save</button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">{s.price}</span>
                        {s.original_price && <span className="text-gray-400 line-through text-xs font-medium">{s.original_price}</span>}
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => setEditingService(s.id)} className="text-blue-600 text-sm underline font-semibold">Edit</button>
                         <button onClick={() => deleteItem('services', s.id)} className="text-red-500"><FaTrash /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaUpload/> Upload Manager</h2>
              <div className="grid md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <select className="w-full border p-3 rounded-lg bg-gray-50" value={slideSection} onChange={(e) => setSlideSection(e.target.value)}>
                    <option value="hero">Home Slider</option>
                    <option value="certificate">Certificate Image</option>
                    <option value="agent">Agent Picture</option>
                  </select>
                </div>
                <div className="md:col-span-6"><input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="w-full border p-2.5 rounded-lg bg-gray-50" /></div>
                <div className="md:col-span-2"><button onClick={uploadImage} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Upload</button></div>
              </div>
            </div>
            {/* Mirror List: Shows what is live on your homepage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {slides.map(img => (
                 <div key={img.id} className="border rounded-xl overflow-hidden relative shadow-sm group">
                    <img src={img.image_url} className="w-full h-32 object-cover" />
                    <div className="p-2 flex justify-between items-center bg-gray-50">
                       <span className="text-[10px] font-bold uppercase text-blue-600">{img.section}</span>
                       <button onClick={() => deleteItem('content', img.id)} className="text-red-500"><FaTrash/></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaNewspaper /> Create Blog Post</h2>
              <form onSubmit={createPost} className="space-y-5">
                <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Post Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-3 rounded-lg" placeholder="Post Excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="flex gap-4">
                   <input type="file" className="w-full border p-3 rounded-lg" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                   <select className="border p-3 rounded-lg font-bold text-sm" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
                      <option value="Business">Business</option>
                      <option value="CAC">CAC News</option>
                   </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-950 text-white font-bold py-3 rounded-lg">Publish Post</button>
              </form>
            </div>
            <div className="space-y-3">
               {posts.map(post => (
                 <div key={post.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                       {post.media_url && <img src={post.media_url} className="w-10 h-10 rounded object-cover shadow-sm" />}
                       <span className="font-bold text-sm">{post.title}</span>
                    </div>
                    <button onClick={() => deleteItem('blog', post.id)} className="text-red-500"><FaTrash /></button>
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