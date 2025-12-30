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
  const [isVerifying, setIsVerifying] = useState(true); // NEW: Auth verification state
  const [isAuthorized, setIsAuthorized] = useState(false); // NEW: Authorization check

  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  const [slideFile, setSlideFile] = useState(null);
  const [slideSection, setSlideSection] = useState('hero'); 
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', category: 'Business', media: null });
  const [editingService, setEditingService] = useState(null);
  const [apiError, setApiError] = useState(null);

  // 🔒 SECURITY: Triple-layer verification - prevent any rendering until verified
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.warn('No session found');
          setIsVerifying(false);
          setIsAuthorized(false);
          setTimeout(() => navigate('/login', { replace: true }), 100);
          return;
        }

        const userEmail = session.user?.email;
        console.log('User email:', userEmail);
        
        if (userEmail === ADMIN_EMAIL) {
          setIsAuthorized(true);
          setIsVerifying(false);
        } else {
          console.warn('Unauthorized user attempted admin access:', userEmail);
          setIsAuthorized(false);
          setIsVerifying(false);
          setTimeout(() => navigate('/', { replace: true }), 100);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
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

  // NEW: Block rendering if still verifying or not authorized
  if (isVerifying) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-blue-600 mb-4 text-4xl">🔐</div>
          <p className="font-bold text-gray-700">Verifying Admin Access...</p>
          <p className="text-sm text-gray-500 mt-2">Security check in progress</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="font-bold text-red-700 text-xl">❌ Access Denied</p>
          <p className="text-red-600 mt-2">You do not have permission to access the admin panel</p>
        </div>
      </div>
    );
  }

  // NEW: Helper function to get the security token for the backend
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Hoisted function so useEffect can call it safely before declaration
  async function fetchData() {
    setLoading(true);
    setApiError(null);
    try {
      if (activeTab === 'services') {
        try {
          const res = await axios.get(`${API_URL}/services`);
          setServices(res.data || []);
        } catch (err) {
          console.error('Services fetch error:', err);
          setServices([]);
          setApiError('Could not load services. Ensure backend is running.');
        }
      } else if (activeTab === 'content') {
        try {
          const res = await axios.get(`${API_URL}/slides`);
          setSlides(res.data || []);
        } catch (err) {
          console.error('Slides fetch error:', err);
          setSlides([]);
          setApiError('Could not load images. Ensure backend is running.');
        }
      } else if (activeTab === 'blog') {
        try {
          const res = await axios.get(`${API_URL}/posts`);
          console.log('Posts response:', res.data);
          setPosts(res.data || []);
          setApiError(null);
        } catch (err) {
          console.error('Posts fetch error:', err);
          setPosts([]);
          const errorMsg = err.response?.data?.error || err.message || 'Could not load blog posts';
          setApiError(`Error: ${errorMsg}. Make sure the 'posts' table exists in Supabase.`);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to load data';
      console.error(`API Error (${activeTab}):`, msg);
      setApiError(msg);
    }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const saveServicePrice = async (id, newPrice) => {
    try {
      const config = await getAuthHeaders(); // Adds the "Key"
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice }, config);
      notify("Price updated!");
      setEditingService(null);
      fetchData();
    } catch (err) { alert("Unauthorized: Access Denied"); }
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
    await supabase.auth.signOut(); // Logs out of Supabase
    localStorage.removeItem('token'); // Clears the local key
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
            {apiError && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{apiError}</div>}
            {loading && <p className="text-gray-500">Loading services...</p>}
            {!loading && services.length === 0 && <p className="text-gray-500">No services found. Connect backend API.</p>}
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50">
                  <span className="font-bold text-gray-700">{s.title}</span>
                  {editingService === s.id ? (
                    <div className="flex gap-2">
                      <input type="text" id={`price-${s.id}`} defaultValue={s.price} className="border p-1 w-24 rounded" />
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`price-${s.id}`).value)} className="bg-green-600 text-white px-3 text-sm rounded">Save</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">{s.price}</span>
                      <button onClick={() => setEditingService(s.id)} className="text-blue-600 text-sm underline">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab and logic remain the same but now use the secure upload function */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaUpload/> Upload Manager</h2>
              <div className="grid md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image Location</label>
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

        {activeTab === 'blog' && (
          <div className="space-y-8">
            {/* Create Blog Post Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaNewspaper /> Create Blog Post</h2>
              {apiError && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{apiError}</div>}
              
              <form onSubmit={createPost} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter blog post title"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Post Excerpt</label>
                  <textarea 
                    required 
                    className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Enter a brief summary of your post"
                    rows="3"
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select 
                      required 
                      className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={postForm.category}
                      onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                    >
                      <option value="Business">Business</option>
                      <option value="CAC">CAC (Corporate Affairs)</option>
                      <option value="Updates">Updates</option>
                      <option value="News">News</option>
                      <option value="Tips">Tips & Guides</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="w-full border p-3 rounded-lg bg-gray-50"
                      onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading} 
                  className="w-full bg-blue-950 text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition disabled:opacity-70"
                >
                  {loading ? 'Publishing...' : 'Publish Post'}
                </button>
              </form>
            </div>

            {/* Blog Posts List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6">Published Posts</h2>
              {apiError && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{apiError}</div>}
              {loading && <p className="text-gray-500">Loading posts...</p>}
              {!loading && posts.length === 0 && <p className="text-gray-500">No blog posts yet. Create your first post above!</p>}
              
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800 mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                        <div className="flex gap-3 flex-wrap">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">{post.category}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at || post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteItem('posts', post.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-lg transition"
                        title="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
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