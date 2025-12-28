import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, DollarSign, Image as ImageIcon, LogOut, Newspaper } from 'lucide-react';

// Import Managers
import ContentManager from './admin/ContentManager';
import PriceManager from './admin/PriceManager';
import NewsManager from './admin/NewsManager'; // <--- NEW IMPORT

const API_URL = "http://localhost:5000/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [stats, setStats] = useState({ totalRevenue: 0, transactions: [] });
  const navigate = useNavigate();

  // Fetch Revenue Stats
  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then(res => res.json())
      .then(data => {
         const total = data.reduce((sum, t) => sum + parseInt(t.amount || 0), 0);
         setStats({ totalRevenue: total, transactions: data });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-theme-blue">Admin Dashboard</h1>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition">
            <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-4 mb-8">
            {[
                { id: 'revenue', label: 'Revenue', icon: LayoutDashboard },
                { id: 'prices', label: 'Manage Prices', icon: DollarSign },
                { id: 'slider', label: 'Website Content', icon: ImageIcon },
                { id: 'news', label: 'News & Blog', icon: Newspaper }, // <--- ADDED BACK
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-theme-blue text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <tab.icon size={18}/> {tab.label}
                </button>
            ))}
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="animate-in fade-in duration-300">
            
            {/* 1. REVENUE */}
            {activeTab === 'revenue' && (
                <div className="space-y-6">
                    <div className="bg-theme-green text-white p-8 rounded-2xl shadow-lg flex justify-between items-center">
                        <div>
                            <p className="text-green-100 font-medium mb-1">Total Revenue</p>
                            <h2 className="text-5xl font-bold">₦{stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full"><DollarSign size={40}/></div>
                    </div>
                </div>
            )}

            {/* 2. CONTENT MANAGER */}
            {activeTab === 'slider' && <ContentManager />}

            {/* 3. PRICE MANAGER */}
            {activeTab === 'prices' && <PriceManager />}

            {/* 4. NEWS MANAGER (NEW!) */}
            {activeTab === 'news' && <NewsManager />}

        </div>
      </div>
    </div>
  );
}