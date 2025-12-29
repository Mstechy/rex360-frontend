import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, FaNewspaper, FaUpload, FaUserTie, FaCertificate } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://rex360backend.vercel.app/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // DATA
  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  // FORMS
  const [slideFile, setSlideFile] = useState(null);
  const [slideSection, setSlideSection] = useState('hero'); // 'hero', 'certificate', 'agent'
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', category: 'Business', media: null });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await axios.get(`${API_URL}/services`);
        setServices(res.data);
      } else if (activeTab === 'content') {
        const res = await axios.get(`${API_URL}/slides`);
        setSlides(res.data);
      } else if (activeTab === 'blog') {
        const res = await axios.get(`${API_URL}/posts`);
        setPosts(res.data);
      }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // --- HANDLERS ---
  const saveServicePrice = async (id, newPrice) => {
    try {
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice });
      notify("Price updated!");
      setEditingService(null);
      fetchData();
    } catch (err) { alert("Update failed"); }
  };

  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image first");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', slideSection); // Sends 'hero', 'certificate', or 'agent'

    setLoading(true);
    try {
      await axios.post(`${API_URL}/slides`, formData);
      notify(`${slideSection.toUpperCase()} Uploaded!`);
      setSlideFile(null);
      fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`);
      fetchData();
    } catch(err) { alert("Delete failed"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(postForm).forEach(key => formData.append(key, postForm[key]));
    setLoading(true);
    try {
      await axios.post(`${API_URL}/posts`, formData);
      notify("Post created!");
      setPostForm({ title: '', excerpt: '', category: 'Business', media: null });
      fetchData();
    } catch (err) { alert("Failed to create post"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* HEADER */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">REX360 Admin</h1>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2 text-sm transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {notification && <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce font-medium">{notification}</div>}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'services', icon: FaMoneyBillWave, label: 'Prices & Services' },
            { id: 'content', icon: FaImages, label: 'Website Images' },
            { id: 'blog', icon: FaNewspaper, label: 'News & Blog' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm border border-gray-100'}`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- 1. MANAGE PRICES --- */}
        {activeTab === 'services' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-800">Service Price List</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="border border-gray-100 p-4 rounded-xl flex justify-between items-center bg-gray-50 hover:bg-white transition-colors">
                  <span className="font-bold text-gray-700">{s.title}</span>
                  {editingService === s.id ? (
                    <div className="flex gap-2 animate-fade-in">
                      <input type="text" id={`price-${s.id}`} defaultValue={s.price} className="border border-gray-300 p-1 w-24 rounded focus:ring-2 focus:ring-green-500 outline-none" />
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`price-${s.id}`).value)} className="bg-green-600 text-white px-3 text-sm rounded hover:bg-green-700">Save</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">{s.price}</span>
                      <button onClick={() => setEditingService(s.id)} className="text-blue-600 text-sm hover:underline">Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 2. WEBSITE CONTENT (IMAGES) --- */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* UPLOAD CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><FaUpload className="text-blue-600"/> Upload Manager</h2>
              <div className="grid md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image Location</label>
                  <select 
                    className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={slideSection}
                    onChange={(e) => setSlideSection(e.target.value)}
                  >
                    <option value="hero">🏠 Home Page Slider</option>
                    <option value="certificate">📜 Certificate Image</option>
                    <option value="agent">👤 Agent Picture</option>
                  </select>
                </div>
                <div className="md:col-span-6">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Select File</label>
                   <input type="file" onChange={(e) => setSlideFile(e.target.files[0])} className="w-full border p-2.5 rounded-lg bg-gray-50 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <div className="md:col-span-2">
                  <button onClick={uploadImage} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg">
                    {loading ? '...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>

            {/* GALLERY GRID */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* HERO SLIDER SECTION */}
              <div className="lg:col-span-2">
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm flex items-center gap-2 border-b pb-2"><FaImages/> Home Slider Images</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {slides.filter(s => s.section === 'hero').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg border border-gray-200">
                        <img src={slide.image_url} className="w-full h-32 object-cover rounded" />
                        <button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-800 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110">
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {slides.filter(s => s.section === 'hero').length === 0 && <div className="p-4 bg-gray-50 rounded text-sm text-gray-400">No slider images yet.</div>}
                 </div>
              </div>

              {/* CERTIFICATE SECTION */}
              <div>
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm flex items-center gap-2 border-b pb-2"><FaCertificate/> Certificate Image</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {slides.filter(s => s.section === 'certificate').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg border border-gray-200">
                        <img src={slide.image_url} className="w-full h-40 object-contain bg-gray-50 rounded" />
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded shadow">ACTIVE</div>
                        <button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-800">
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {slides.filter(s => s.section === 'certificate').length === 0 && <div className="p-4 bg-gray-50 rounded text-sm text-gray-400 border border-dashed border-gray-300">No certificate uploaded.</div>}
                 </div>
              </div>

              {/* AGENT SECTION */}
              <div>
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm flex items-center gap-2 border-b pb-2"><FaUserTie/> Agent Picture</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {slides.filter(s => s.section === 'agent').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg border border-gray-200">
                        <img src={slide.image_url} className="w-full h-40 object-cover rounded" />
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded shadow">ACTIVE</div>
                        <button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-800">
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {slides.filter(s => s.section === 'agent').length === 0 && <div className="p-4 bg-gray-50 rounded text-sm text-gray-400 border border-dashed border-gray-300">No agent picture uploaded.</div>}
                 </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 3. NEWS & BLOG --- */}
        {activeTab === 'blog' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Create News Post</h2>
            <form onSubmit={createPost} className="space-y-4 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title" className="border p-3 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" required onChange={e => setPostForm({...postForm, title: e.target.value})} />
                <select className="border p-3 rounded-lg bg-gray-50" onChange={e => setPostForm({...postForm, category: e.target.value})}>
                  <option>Business</option><option>Tax</option><option>CAC News</option>
                </select>
              </div>
              <textarea placeholder="Write short summary..." className="border p-3 w-full rounded-lg bg-gray-50 h-24 focus:ring-2 focus:ring-green-500 outline-none" required onChange={e => setPostForm({...postForm, excerpt: e.target.value})}></textarea>
              <div className="flex gap-4">
                <input type="file" className="text-sm text-gray-500" onChange={e => setPostForm({...postForm, media: e.target.files[0]})} />
                <button className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md flex-1">Publish</button>
              </div>
            </form>
            <div className="space-y-3">
              {posts.map(post => (
                 <div key={post.id} className="flex justify-between items-center border border-gray-100 p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      {post.media_url && <img src={post.media_url} className="w-10 h-10 rounded object-cover"/>}
                      <span className="font-medium text-gray-700">{post.title}</span>
                    </div>
                    <button onClick={() => deleteItem('posts', post.id)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
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