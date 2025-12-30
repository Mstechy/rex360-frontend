import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import the client you shared
import { FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, FaNewspaper, FaUpload } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';
const ADMIN_EMAIL = 'rex360solutions@gmail.com'; // Only admin email

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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setIsVerifying(false);
          setIsAuthorized(false);
          setTimeout(() => navigate('/login', { replace: true }), 100);
          return;
        }

        const userEmail = session.user?.email;
        if (userEmail === ADMIN_EMAIL) {
          setIsAuthorized(true);
          setIsVerifying(false);
        } else {
          setIsAuthorized(false);
          setIsVerifying(false);
          setTimeout(() => navigate('/', { replace: true }), 100);
        }
      } catch (err) {
        setIsVerifying(false);
        setIsAuthorized(false);
        setTimeout(() => navigate('/login', { replace: true }), 100);
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  useEffect(() => { 
    if (isAuthorized) fetchData(); 
  }, [activeTab, isAuthorized]);

  if (isVerifying) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-blue-600 mb-4 text-4xl">🔐</div>
          <p className="font-bold text-gray-700">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="font-bold text-red-700 text-xl">❌ Access Denied</p>
        </div>
      </div>
    );
  }

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  async function fetchData() {
    setLoading(true);
    setApiError(null);
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
    } catch (error) {
      setApiError('Failed to load data.');
    }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // STRICT UPDATE: Modified to handle the "Reduced Price" logic
  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders(); 
      // Sends both the current price and the price to be cancelled
      await axios.put(`${API_URL}/services/${id}`, { 
        price: newPrice, 
        original_price: oldPrice 
      }, config);
      notify("Price updated!");
      setEditingService(null);
      fetchData();
    } catch (err) { 
      alert("Upload failed! Ensure 'original_price' column exists in Supabase."); 
    }
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
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      notify("Image Uploaded!");
      setSlideFile(null);
      fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Are you sure?")) return;
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
        headers: { 
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'multipart/form-data' 
        }
      }); 
      notify("Post created!"); 
      fetchData(); 
    } catch (err) { alert("Failed"); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold text-gray-900">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2 text-sm">
          <FaSignOutAlt /> Logout
        </button>
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
                        <input type="text" id={`price-${s.id}`} defaultValue={s.price} placeholder="Sale Price (e.g. ₦8,000)" className="border p-2 w-full rounded" />
                        <input type="text" id={`old-price-${s.id}`} defaultValue={s.original_price} placeholder="Old Price (e.g. ₦10,000)" className="border p-2 w-full rounded" />
                      </div>
                      <button 
                        onClick={() => saveServicePrice(
                          s.id, 
                          document.getElementById(`price-${s.id}`).value, 
                          document.getElementById(`old-price-${s.id}`).value
                        )} 
                        className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                      >
                        Save Pricing
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                          {s.price}
                        </span>
                        {s.original_price && (
                          <span className="text-gray-400 line-through text-xs font-medium">
                            {s.original_price}
                          </span>
                        )}
                      </div>
                      <button onClick={() => setEditingService(s.id)} className="text-blue-600 text-sm underline font-semibold">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab stays exactly the same */}
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
                <div className="md:col-span-2"><button onClick={uploadImage} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">{loading ? '...' : 'Upload'}</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Tab stays exactly the same */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaNewspaper /> Create Blog Post</h2>
              <form onSubmit={createPost} className="space-y-5">
                <input type="text" required className="w-full border p-3 rounded-lg" placeholder="Title" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} />
                <textarea required className="w-full border p-3 rounded-lg" placeholder="Excerpt" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="grid md:grid-cols-2 gap-4">
                  <select className="w-full border p-3 rounded-lg" value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})}>
                    <option value="Business">Business</option>
                    <option value="CAC">CAC</option>
                    <option value="Updates">Updates</option>
                  </select>
                  <input type="file" className="w-full border p-3 rounded-lg" onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})} />
                </div>
                <button type="submit" className="w-full bg-blue-950 text-white font-bold py-3 rounded-lg">Publish Post</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;