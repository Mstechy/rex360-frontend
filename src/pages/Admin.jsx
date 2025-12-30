import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, FaNewspaper, FaUpload, FaEdit } from 'react-icons/fa';

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
    return { headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' } };
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
    } catch (error) { setApiError("Check Database Connection"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders();
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Failed to save price changes."); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', slideSection);
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post(`${API_URL}/slides`, formData, {
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'multipart/form-data' }
      });
      notify("Uploaded!"); setSlideFile(null); fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Delete this from Homepage?")) return;
    try { 
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${endpoint}/${id}`, config); 
      fetchData(); 
    } catch(err) { alert("Delete failed"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(postForm).forEach(key => formData.append(key, postForm[key]));
    setLoading(true);
    try { 
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'multipart/form-data' }
      }); 
      notify("Post Published!"); fetchData(); 
    } catch (err) { alert("Post failed"); }
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">Verifying Access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2"><FaSignOutAlt /> Logout</button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white border'}`}>Prices & Services</button>
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'content' ? 'bg-black text-white' : 'bg-white border'}`}>Website Images</button>
          <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'blog' ? 'bg-black text-white' : 'bg-white border'}`}>News & Blog</button>
        </div>

        {/* 1. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="font-bold text-gray-800">{s.title}</p>
                {editingService === s.id ? (
                  <div className="mt-3 flex gap-2">
                    <input id={`p-${s.id}`} defaultValue={s.price} className="border p-1 w-full rounded" />
                    <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-1 w-full rounded" />
                    <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="bg-green-600 text-white px-3 rounded">Save</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <span className="font-bold text-blue-600">{s.price}</span>
                      {s.original_price && <span className="ml-2 text-gray-400 line-through text-sm">{s.original_price}</span>}
                    </div>
                    <button onClick={() => setEditingService(s.id)} className="text-blue-500"><FaEdit/></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. IMAGES TAB (Mirror of your Homepage Slides/Agent/Cert) */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4 flex items-center gap-2"><FaUpload/> Upload New Image</h2>
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

            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Current Homepage Content</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map((img) => (
                  <div key={img.id} className="border rounded-lg overflow-hidden group relative">
                    <img src={img.image_url} alt="Content" className="w-full h-32 object-cover" />
                    <div className="p-2 flex justify-between items-center bg-gray-50">
                      <span className="text-[10px] font-bold uppercase text-blue-600">{img.section}</span>
                      <button onClick={() => deleteItem('slides', img.id)} className="text-red-500"><FaTrash/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. BLOG TAB */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Create New Post</h2>
              <form onSubmit={createPost} className="space-y-4">
                <input type="text" required placeholder="Title" className="w-full border p-2 rounded" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required placeholder="Excerpt" className="w-full border p-2 rounded" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded font-bold">Publish</button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Manage Posts</h2>
              {posts.map(post => (
                <div key={post.id} className="flex justify-between items-center border-b py-2">
                  <span className="font-medium">{post.title}</span>
                  <button onClick={() => deleteItem('posts', post.id)} className="text-red-500"><FaTrash/></button>
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