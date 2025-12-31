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
    setLoading(true); setApiError(null);
    try {
      const endpoint = activeTab === 'content' ? 'slides' : (activeTab === 'blog' ? 'posts' : 'services');
      const res = await axios.get(`${API_URL}/${endpoint}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) { setApiError('Backend sync failed'); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders();
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Save Failed: Ensure 'original_price' column exists in Supabase."); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile); // Key matches backend upload.single('image')
    formData.append('section', slideSection); 
    setLoading(true);
    try {
      const config = await getAuthHeaders(true);
      await axios.post(`${API_URL}/slides`, formData, config);
      notify("Image Uploaded!"); setSlideFile(null); fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Permanent Delete?")) return;
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
    if (postForm.media) formData.append('media', postForm.media); // Key matches backend upload.single('media')

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

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">🔐 Authenticating...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border'}`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border flex flex-col justify-between shadow-sm">
                <div>
                   <p className="font-bold text-gray-700">{s.title}</p>
                   {editingService === s.id ? (
                    <div className="mt-3 space-y-2">
                      <input id={`p-${s.id}`} defaultValue={s.price} className="border p-2 w-full rounded text-sm" placeholder="Current Price" />
                      <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-2 w-full rounded text-sm" placeholder="Original Price" />
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="w-full bg-green-600 text-white py-2 rounded font-bold">Save</button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-baseline gap-2">
                       <span className="text-lg font-bold text-blue-600">{s.price}</span>
                       {s.original_price && <span className="text-gray-400 line-through text-xs">{s.original_price}</span>}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center border-t pt-2">
                   <button onClick={() => setEditingService(s.id)} className="text-blue-500 text-sm font-bold">Edit Price</button>
                   <button onClick={() => deleteItem('services', s.id)} className="text-red-500"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaUpload/> Image Upload</h2>
              <div className="flex flex-wrap gap-4 items-end">
                <select className="border p-3 rounded-lg bg-gray-50 text-sm" value={slideSection} onChange={(e) => setSlideSection(e.target.value)}>
                    <option value="hero">Home Slider</option>
                    <option value="certificate">Validation Certificate</option>
                    <option value="agent">Authorized Agent</option>
                </select>
                <input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="border p-2 rounded-lg bg-gray-50 text-sm" />
                <button onClick={uploadImage} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">Upload</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {slides.map(img => (
                 <div key={img.id} className="group border rounded-xl overflow-hidden relative shadow-sm bg-white">
                    <img src={img.image_url} className="w-full h-32 object-cover" />
                    <div className="p-2 flex justify-between items-center bg-gray-50">
                       <span className="text-[10px] font-bold uppercase text-blue-600">{img.section}</span>
                       <button onClick={() => deleteItem('content', img.id)} className="text-red-500 hover:scale-110 transition-transform"><FaTrash/></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="text-lg font-bold mb-6">Create Post</h2>
              <form onSubmit={createPost} className="space-y-4">
                <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Post Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-3 rounded-lg h-32" placeholder="Post Excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="flex items-center gap-4">
                   <input type="file" className="border p-2 rounded-lg text-sm w-full" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                   <select className="border p-3 rounded-lg text-sm font-bold" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
                      <option value="Business">Business</option>
                      <option value="CAC">CAC Updates</option>
                      <option value="News">News</option>
                   </select>
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-lg font-bold">Publish Post</button>
              </form>
            </div>
            <div className="space-y-3">
               {posts.map(post => (
                 <div key={post.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                       {post.media_url && <img src={post.media_url} className="w-10 h-10 rounded object-cover shadow-sm" />}
                       <span className="font-bold text-sm text-gray-700">{post.title}</span>
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