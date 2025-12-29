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

  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [posts, setPosts] = useState([]);

  const [slideFile, setSlideFile] = useState(null);
  const [slideSection, setSlideSection] = useState('hero'); 
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
    formData.append('section', slideSection); 

    setLoading(true);
    try {
      await axios.post(`${API_URL}/slides`, formData);
      notify("Image Uploaded!");
      setSlideFile(null);
      fetchData();
    } catch (err) { alert("Upload failed"); }
    setLoading(false);
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Are you sure?")) return;
    try { await axios.delete(`${API_URL}/${endpoint}/${id}`); fetchData(); } catch(err) { alert("Delete failed"); }
  };

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(postForm).forEach(key => formData.append(key, postForm[key]));
    setLoading(true);
    try { await axios.post(`${API_URL}/posts`, formData); notify("Post created!"); fetchData(); } catch (err) { alert("Failed"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold text-gray-900">REX360 Admin</h1>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="text-red-600 font-bold flex items-center gap-2 text-sm">
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

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm border-b pb-2">Home Slider</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {slides.filter(s => s.section === 'hero').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg"><img src={slide.image_url} className="w-full h-32 object-cover rounded" /><button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"><FaTrash size={10} /></button></div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm border-b pb-2">Certificate</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {slides.filter(s => s.section === 'certificate').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg"><img src={slide.image_url} className="w-full h-40 object-contain bg-gray-50 rounded" /><button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"><FaTrash size={10} /></button></div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="font-bold text-gray-500 uppercase mb-3 text-sm border-b pb-2">Agent</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {slides.filter(s => s.section === 'agent').map(slide => (
                      <div key={slide.id} className="relative group bg-white p-1 shadow-sm rounded-lg"><img src={slide.image_url} className="w-full h-40 object-cover rounded" /><button onClick={() => deleteItem('slides', slide.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"><FaTrash size={10} /></button></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;