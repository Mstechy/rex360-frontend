import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

export default function PriceManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load current prices from database
  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then(res => res.json())
      .then(data => {
        if(data) setServices(data);
      })
      .catch(console.error);
  }, []);

  // 2. Handle typing new prices
  const handleChange = (id, newPrice) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  // 3. Save to Database
  const handleSave = (id, price) => {
    setLoading(true);
    fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
    })
    .then(res => res.json())
    .then(() => alert("✅ Price Updated Successfully!"))
    .catch(() => alert("❌ Failed to update price."))
    .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold mb-6 text-theme-blue">Manage Service Prices</h2>
      
      <div className="space-y-4">
        {services.length === 0 && <p className="text-gray-400">Loading services...</p>}

        {services.map((service) => (
            <div key={service.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg border gap-4">
                
                {/* Service Name */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={`w-3 h-3 rounded-full ${service.id === 'biz-name' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className="font-bold text-gray-700">{service.title}</span>
                </div>

                {/* Price Input & Save Button */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <input 
                        type="text" 
                        value={service.price}
                        onChange={(e) => handleChange(service.id, e.target.value)}
                        className="border p-2 rounded w-full sm:w-32 text-right font-mono font-bold text-theme-blue focus:ring-2 focus:ring-theme-green outline-none"
                    />
                    <button 
                        onClick={() => handleSave(service.id, service.price)} 
                        className="bg-theme-green text-white p-2 rounded hover:bg-theme-greenDark transition shadow-sm"
                        title="Save Price"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}