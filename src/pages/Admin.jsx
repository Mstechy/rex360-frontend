import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import { FaTrash, FaSignOutAlt, FaMoneyBillWave, FaImages, FaNewspaper, FaUpload, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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

  // 🔒 Security Verification
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session || session.user?.email !== ADMIN_EMAIL) {
          setIsAuthorized(false);
          setIsVerifying(false);
          setTimeout(() => navigate('/login', { replace: true }), 100);
          return;
        }
        setIsAuthorized(true);
        setIsVerifying(false);
      } catch (err) {
        setIsVerifying(false);
        navigate('/login', { replace: true });
      }
    };
    verifyAdminAccess();
  }, [navigate]);

  useEffect(() => { 
    if (isAuthorized) fetchData(); 
  }, [activeTab, isAuthorized]);

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
    try {
      const res = await axios.get(`${API_URL}/${activeTab === 'content' ? 'slides' : activeTab}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) {
      setApiError("Failed to fetch data. Check backend connection.");
    }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  // 🏷️ Updated Price Saver with Strikethrough
  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders(); 
      await axios.put(`${API_URL}/services/${id}`, { 
        price: newPrice, 
        original_price: oldPrice 
      }, config);
      notify("Pricing Updated!");
      setEditingService(null);
      fetchData();
    } catch (err) { 
        alert("Upload failed. Ensure 'original_price' column exists in your Supabase 'services' table."); 
    }
  };

  // Remaining upload/delete functions
  const uploadImage = async () => {
    if (!slideFile) return alert("Select an image");
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('section', slideSection); 
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.post(`${API_URL}/slides`, formData, {
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'multipart/form-data' }
      });
      notify("Uploaded!"); fetchData();
    } catch (err) { alert("Upload failed"); }
  };

  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Delete this item?")) return;
    try { 
      const config = await getAuthHeaders();
      await axios.delete(`${API_URL}/${endpoint}/${id}`, config); 
      fetchData(); 
    } catch(err) { alert("Delete failed"); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">Verifying...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2"><FaSignOutAlt /> Logout</button>
      </div>

      {notification && <div className="fixed top-20 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">{notification}</div>}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white border'}`}>Services</button>
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'content' ? 'bg-black text-white' : 'bg-white border'}`}>Images</button>
          <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'blog' ? 'bg-black text-white' : 'bg-white border'}`}>Blog</button>
        </div>

        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border shadow-sm">
                <p className="font-bold text-gray-800 mb-3">{s.title}</p>
                {editingService === s.id ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input id={`p-${s.id}`} defaultValue={s.price} className="border p-2 w-full rounded" placeholder="New Price" />
                      <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-2 w-full rounded" placeholder="Old Price (Optional)" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex-grow font-bold">Save</button>
                      <button onClick={() => setEditingService(null)} className="bg-gray-200 px-4 py-2 rounded-lg"><FaTimes /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-blue-600">${s.price}</span>
                      {s.original_price && <span className="ml-2 text-gray-400 line-through">${s.original_price}</span>}
                    </div>
                    <button onClick={() => setEditingService(s.id)} className="text-gray-400 hover:text-blue-600"><FaEdit size={20}/></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Blog & Content sections remain the same... */}
      </div>
    </div>
  );
};

export default Admin;