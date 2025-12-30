// Save this into src/pages/Admin.jsx
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
      } catch (err) {
        navigate('/login', { replace: true });
      }
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
      const res = await axios.get(`${API_URL}/${activeTab === 'content' ? 'slides' : activeTab}`);
      if (activeTab === 'services') setServices(res.data || []);
      else if (activeTab === 'content') setSlides(res.data || []);
      else if (activeTab === 'blog') setPosts(res.data || []);
    } catch (error) { setApiError("Check API connection"); }
    setLoading(false);
  }

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const saveServicePrice = async (id, newPrice, oldPrice) => {
    try {
      const config = await getAuthHeaders(); 
      await axios.put(`${API_URL}/services/${id}`, { price: newPrice, original_price: oldPrice }, config);
      notify("Price updated!"); setEditingService(null); fetchData();
    } catch (err) { alert("Update failed - check Supabase columns"); }
  };

  // ... (uploadImage, deleteItem, createPost, handleLogout functions remain same as yours)
  const uploadImage = async () => { /* your existing code */ };
  const deleteItem = async (endpoint, id) => { /* your existing code */ };
  const createPost = async (e) => { /* your existing code */ };
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (isVerifying) return <div className="min-h-screen flex items-center justify-center font-bold">Verifying Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header stays same */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-bold">REX360 Admin</h1>
        <button onClick={handleLogout} className="text-red-600 font-bold flex items-center gap-2"><FaSignOutAlt /> Logout</button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs stay same */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white border'}`}>Services</button>
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'content' ? 'bg-black text-white' : 'bg-white border'}`}>Images</button>
          <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'blog' ? 'bg-black text-white' : 'bg-white border'}`}>Blog</button>
        </div>

        {activeTab === 'services' && (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="font-bold text-gray-800 mb-2">{s.title}</p>
                {editingService === s.id ? (
                  <div className="space-y-2">
                    <input id={`p-${s.id}`} defaultValue={s.price} className="border p-2 w-full rounded" placeholder="New Price" />
                    <input id={`op-${s.id}`} defaultValue={s.original_price} className="border p-2 w-full rounded" placeholder="Old Price (Optional)" />
                    <button onClick={() => saveServicePrice(s.id, document.getElementById(`p-${s.id}`).value, document.getElementById(`op-${s.id}`).value)} className="w-full bg-green-600 text-white py-2 rounded font-bold">Save</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-blue-600">${s.price}</span>
                      {s.original_price && <span className="ml-2 text-gray-400 line-through text-sm">${s.original_price}</span>}
                    </div>
                    <button onClick={() => setEditingService(s.id)} className="text-blue-500 text-sm">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Admin;