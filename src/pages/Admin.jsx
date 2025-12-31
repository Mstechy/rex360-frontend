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

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { headers: { 'Authorization': `Bearer ${session?.access_token}` } };
  };

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await axios.get(`${API_URL}/services`);
        setServices(res.data || []);
      } else if (activeTab === 'content') {
        const res = await axios.get(`${API_URL}/slides`);
        setSlides(res.data || []);
      } else if (activeTab === 'blog') {
        const res = await axios.get(`${API_URL}/posts`);
        setPosts(res.data || []);
      }
    } catch (error) { setApiError("Sync failed"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // FIX: Delete Functionality
  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Are you sure? This will remove it from the homepage.")) return;
    try { 
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${endpoint}/${id}`, config); 
      notify("Item deleted!");
      fetchData(); 
    } catch(err) { alert("Delete failed. Check your connection."); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postForm.title);
    formData.append('excerpt', postForm.excerpt);
    formData.append('category', postForm.category);
    if (postForm.media) formData.append('image', postForm.media); // FIX: Now sends image

    setLoading(true);
    try { 
      const config = await getAuthHeaders(); // Fixed: Use common headers
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { 
          ...config.headers,
          'Content-Type': 'multipart/form-data' 
        }
      }); 
      notify("Post created with image!"); 
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData(); 
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">Verifying...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2 text-sm"><FaSignOutAlt /> Logout</button>
      </div>

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
                <div key={s.id} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50">
                  <span className="font-bold text-gray-700">{s.title}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-700 font-bold">{s.price}</span>
                    <button onClick={() => deleteItem('services', s.id)} className="text-red-500"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Live Images (Slides/Agents)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slides.map((slide) => (
                <div key={slide.id} className="border rounded-xl overflow-hidden shadow-sm">
                  <img src={slide.image_url} className="w-full h-24 object-cover" />
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold">{slide.section}</span>
                    <button onClick={() => deleteItem('slides', slide.id)} className="text-red-500"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6">Create Blog Post</h2>
              <form onSubmit={createPost} className="space-y-4">
                <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-3 rounded-lg" placeholder="Excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                {/* STRICT FIX: Added Image Upload Field for Blog */}
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Featured Image</label>
                   <input type="file" className="w-full border p-2 rounded-lg" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold">Publish Post</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6">Manage Blog Posts</h2>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="flex justify-between items-center border p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-4">
                      {post.image_url && <img src={post.image_url} className="w-12 h-12 object-cover rounded shadow" />}
                      <span className="font-bold">{post.title}</span>
                    </div>
                    <button onClick={() => deleteItem('posts', post.id)} className="text-red-500"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;