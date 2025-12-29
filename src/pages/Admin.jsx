import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUpload, FaMoneyBillWave, FaNewspaper, FaImages, FaSignOutAlt } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services'); // Default tab
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // DATA STATES
  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  // FORM STATES
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', category: 'Business', media: null });
  const [slideFile, setSlideFile] = useState(null);
  const [editingService, setEditingService] = useState(null); // { id, price }

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await axios.get(`${API_URL}/services`);
        setServices(res.data);
      } else if (activeTab === 'slides') {
        const res = await axios.get(`${API_URL}/slides`);
        setSlides(res.data);
      } else if (activeTab === 'blog') {
        const res = await axios.get(`${API_URL}/posts`);
        setPosts(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // --- 2. HANDLERS ---

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper for Success/Error messages
  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- SERVICE HANDLERS ---
  const saveServicePrice = async (id, newPrice) => {
    try {
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice });
      notify("Price updated!");
      setEditingService(null);
      fetchData();
    } catch (err) {
      alert("Failed to update price");
    }
  };

  // --- SLIDE HANDLERS ---
  const uploadSlide = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', 'hero'); // Force it to be a Hero slide

    try {
      setLoading(true);
      await axios.post(`${API_URL}/slides`, formData);
      notify("Slide uploaded!");
      setSlideFile(null);
      fetchData();
    } catch (err) {
      alert("Upload failed");
    }
    setLoading(false);
  };

  const deleteSlide = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await axios.delete(`${API_URL}/slides/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- BLOG HANDLERS ---
  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', postForm.title);
    formData.append('excerpt', postForm.excerpt);
    formData.append('category', postForm.category);
    if (postForm.media) formData.append('media', postForm.media);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/posts`, formData);
      notify("Post created!");
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData();
    } catch (err) {
      alert("Failed to create post");
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-medium">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce">
          {notification}
        </div>
      )}

      {/* TABS */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'services' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 shadow'}`}
          >
            <FaMoneyBillWave /> Manage Prices
          </button>
          <button 
            onClick={() => setActiveTab('slides')}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'slides' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 shadow'}`}
          >
            <FaImages /> Website Content
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'blog' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 shadow'}`}
          >
            <FaNewspaper /> News & Blog
          </button>
        </div>

        {/* --- SECTION 1: MANAGE PRICES --- */}
        {activeTab === 'services' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Service Prices</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="border p-4 rounded flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="font-bold">{service.title}</h3>
                    <p className="text-xs text-gray-500">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingService === service.id ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="border p-1 w-24 rounded" 
                          defaultValue={service.price} 
                          id={`price-${service.id}`}
                        />
                        <button 
                          onClick={() => saveServicePrice(service.id, document.getElementById(`price-${service.id}`).value)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">{service.price}</span>
                        <button 
                          onClick={() => setEditingService(service.id)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 2: WEBSITE CONTENT (SLIDER) --- */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Upload New Slide</h2>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  onChange={(e) => setSlideFile(e.target.files[0])} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                  onClick={uploadSlide} 
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slides.map((slide) => (
                <div key={slide.id} className="relative group bg-white p-2 rounded shadow">
                  <img src={slide.image_url} alt="Slide" className="w-full h-32 object-cover rounded" />
                  <button 
                    onClick={() => deleteSlide(slide.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <FaTrash size={12} />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                    {slide.section}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 3: NEWS & BLOG --- */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Create New Post</h2>
              <form onSubmit={createPost} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Title" 
                    required 
                    className="border p-3 rounded w-full"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  />
                  <select 
                    className="border p-3 rounded w-full"
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                  >
                    <option>Business</option>
                    <option>CAC News</option>
                    <option>Tax</option>
                    <option>Finance</option>
                  </select>
                </div>
                <textarea 
                  placeholder="Short Summary (Excerpt)..." 
                  required 
                  className="border p-3 rounded w-full h-24"
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                ></textarea>
                <input 
                  type="file" 
                  onChange={(e) => setPostForm({...postForm, media: e.target.files[0]})}
                  className="block w-full text-sm text-gray-500"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded font-bold hover:bg-green-700 w-full disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : '+ Publish Post'}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {post.media_url && (
                      <img src={post.media_url} alt="Post" className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <h4 className="font-bold">{post.title}</h4>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{post.category}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
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