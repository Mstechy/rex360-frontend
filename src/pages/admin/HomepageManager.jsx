import React, { useState, useEffect, useCallback } from 'react';
import {
  FaEdit, FaSave, FaTimes, FaUpload, FaSync, FaEye,
  FaImage, FaVideo, FaText, FaList, FaQuestionCircle,
  FaUser, FaAward, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- PRO-MEASURE: CONFIGURATION INTEGRITY ---
const SUPABASE_URL = "https://oohabvgbrzrewwrekkfy.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGFidmdicnpyZXd3cmVra2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg1NjMsImV4cCI6MjA4MTk2NDU2M30.ybMOF5K1dp-mxxaSCtXGdWZd8t7z2jxClbNMkbIMzVE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function HomepageManager() {
  const [activeSection, setActiveSection] = useState('hero');
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Homepage content state
  const [homepageData, setHomepageData] = useState({
    hero: {
      title1: 'Strategic',
      title2: 'Compliance.',
      subtitle: 'Eliminating friction in corporate filings with 100% legal integrity. Professional bridge to the Corporate Affairs Commission.',
      badge: 'Accredited Agency Node',
      cta1: 'Start Registration',
      cta2: 'Track Filing'
    },
    services: [],
    credentials: [],
    faq: [
      { q: "How long does a Company Registration take?", a: "With our priority filing node, we typically achieve a 24 to 48-hour turnaround once documentation is verified." },
      { q: "Is the NIN mandatory for all Directors?", a: "Yes, per current regulations, a valid National Identification Number (NIN) is mandatory for all proprietors, directors, and trustees." },
      { q: "What is required for Annual Returns?", a: "Annual returns are mandatory yearly filings to show the company is still active. Failure to file leads to penalties." }
    ],
    about: {
      title1: 'Strategic',
      title2: 'Compliance.',
      subtitle: 'Eliminating friction in corporate filings with 100% legal integrity.',
      stats: { hours: 24, accuracy: 100 },
      profileImage: 'https://images.unsplash.com/photo-1556157382-97dee2dcb34e?q=80&w=1000',
      bio: 'Accredited Agency Director'
    }
  });

  const [uploadForm, setUploadForm] = useState({
    file: null,
    section: 'hero',
    type: 'image'
  });

  // Fetch homepage data
  const fetchHomepageData = useCallback(async () => {
    setLoading(true);
    try {
      const [slidesRes, servicesRes, credentialsRes] = await Promise.allSettled([
        fetch('/api/slides'),
        fetch('/api/services'),
        fetch('/api/credentials')
      ]);

      if (slidesRes.status === 'fulfilled') {
        // Handle slides data
      }

      if (servicesRes.status === 'fulfilled') {
        setHomepageData(prev => ({
          ...prev,
          services: servicesRes.value.data || []
        }));
      }

      if (credentialsRes.status === 'fulfilled') {
        setHomepageData(prev => ({
          ...prev,
          credentials: credentialsRes.value.data || []
        }));
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadForm.file) return;

    setUploading(true);
    try {
      const fileName = `${uploadForm.section}_${Date.now()}.${uploadForm.file.name.split('.').pop()}`;

      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, uploadForm.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      // Update the appropriate section with the new media URL
      setHomepageData(prev => ({
        ...prev,
        [uploadForm.section]: {
          ...prev[uploadForm.section],
          mediaUrl: publicUrl,
          mediaType: uploadForm.type
        }
      }));

      setUploadForm({ file: null, section: 'hero', type: 'image' });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Save section changes
  const saveSection = async (section, data) => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll just update local state
      setHomepageData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
      setEditingSection(null);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: <FaImage size={14} />, color: 'bg-blue-500' },
    { id: 'services', label: 'Services', icon: <FaList size={14} />, color: 'bg-green-500' },
    { id: 'credentials', label: 'Credentials', icon: <FaAward size={14} />, color: 'bg-purple-500' },
    { id: 'faq', label: 'FAQ Section', icon: <FaQuestionCircle size={14} />, color: 'bg-orange-500' },
    { id: 'about', label: 'About Section', icon: <FaUser size={14} />, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden font-sans">

      {/* HEADER */}
      <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-5">
          <div className="bg-slate-950 p-4 rounded-2xl text-white shadow-lg">
            <FaEdit size={24}/>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Homepage Editor</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Content Management System</p>
          </div>
        </div>
        <div className="px-5 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <FaEye size={14} className="text-green-500"/> Live Preview
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <div className="w-80 bg-slate-50 border-r border-slate-100 p-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Sections</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                  activeSection === section.id
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeSection === section.id ? 'bg-white/20' : 'bg-slate-200'}`}>
                  {section.icon}
                </div>
                <span className="text-sm font-bold">{section.label}</span>
              </button>
            ))}
          </div>

          {/* UPLOAD SECTION */}
          <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Media Upload</h4>
            <div className="space-y-3">
              <select
                value={uploadForm.section}
                onChange={(e) => setUploadForm({...uploadForm, section: e.target.value})}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              >
                <option value="hero">Hero Background</option>
                <option value="about">About Image</option>
                <option value="services">Service Media</option>
              </select>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setUploadForm({
                  ...uploadForm,
                  file: e.target.files[0],
                  type: e.target.files[0]?.type.startsWith('video') ? 'video' : 'image'
                })}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm"
              />
              <button
                onClick={handleFileUpload}
                disabled={!uploadForm.file || uploading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm disabled:bg-slate-400"
              >
                {uploading ? <FaSync className="animate-spin inline mr-2" /> : <FaUpload className="inline mr-2" />}
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-10">

          {/* HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">Hero Section</h3>
                <button
                  onClick={() => setEditingSection(editingSection === 'hero' ? null : 'hero')}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <FaEdit size={14} />
                  {editingSection === 'hero' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingSection === 'hero' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">Title Part 1</label>
                      <input
                        type="text"
                        value={homepageData.hero.title1}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, title1: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">Title Part 2</label>
                      <input
                        type="text"
                        value={homepageData.hero.title2}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, title2: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 mb-2 block">Subtitle</label>
                    <textarea
                      value={homepageData.hero.subtitle}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: e.target.value }
                      }))}
                      className="w-full p-4 border border-slate-200 rounded-xl h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">CTA Button 1</label>
                      <input
                        type="text"
                        value={homepageData.hero.cta1}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, cta1: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">CTA Button 2</label>
                      <input
                        type="text"
                        value={homepageData.hero.cta2}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          hero: { ...prev.hero, cta2: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => saveSection('hero', homepageData.hero)}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2"
                  >
                    <FaSave size={14} />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-black text-slate-900 uppercase mb-4">
                      {homepageData.hero.title1} <span className="text-green-600">{homepageData.hero.title2}</span>
                    </div>
                    <p className="text-slate-600 mb-6">{homepageData.hero.subtitle}</p>
                    <div className="flex justify-center gap-4">
                      <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold">
                        {homepageData.hero.cta1}
                      </button>
                      <button className="px-6 py-3 border border-slate-300 rounded-xl font-bold">
                        {homepageData.hero.cta2}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SERVICES SECTION */}
          {activeSection === 'services' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">Services Section</h3>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                  <FaEdit size={14} className="inline mr-2" />
                  Edit Services
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homepageData.services.map((service, index) => (
                  <div key={service.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-900 uppercase mb-2">{service.title}</h4>
                    <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-slate-900">₦{service.price?.toLocaleString()}</span>
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREDENTIALS SECTION */}
          {activeSection === 'credentials' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">Credentials Section</h3>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                  <FaEdit size={14} className="inline mr-2" />
                  Edit Credentials
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {homepageData.credentials.map((cred, index) => (
                  <div key={cred.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <FaAward size={24} className="text-slate-600" />
                    </div>
                    <h4 className="font-black text-slate-900 uppercase mb-2">{cred.title}</h4>
                    <p className="text-xl font-black text-green-600">{cred.code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ SECTION */}
          {activeSection === 'faq' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">FAQ Section</h3>
                <button
                  onClick={() => setEditingSection(editingSection === 'faq' ? null : 'faq')}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <FaEdit size={14} />
                  {editingSection === 'faq' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingSection === 'faq' ? (
                <div className="space-y-4">
                  {homepageData.faq.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="mb-4">
                        <label className="text-sm font-bold text-slate-600 mb-2 block">Question</label>
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => {
                            const newFaq = [...homepageData.faq];
                            newFaq[index].q = e.target.value;
                            setHomepageData(prev => ({ ...prev, faq: newFaq }));
                          }}
                          className="w-full p-3 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-600 mb-2 block">Answer</label>
                        <textarea
                          value={item.a}
                          onChange={(e) => {
                            const newFaq = [...homepageData.faq];
                            newFaq[index].a = e.target.value;
                            setHomepageData(prev => ({ ...prev, faq: newFaq }));
                          }}
                          className="w-full p-3 border border-slate-200 rounded-xl h-24"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => saveSection('faq', { faq: homepageData.faq })}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2"
                  >
                    <FaSave size={14} />
                    Save FAQ Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {homepageData.faq.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">{item.q}</h4>
                        <FaChevronDown size={14} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === 'about' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">About Section</h3>
                <button
                  onClick={() => setEditingSection(editingSection === 'about' ? null : 'about')}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <FaEdit size={14} />
                  {editingSection === 'about' ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingSection === 'about' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">Title Part 1</label>
                      <input
                        type="text"
                        value={homepageData.about.title1}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          about: { ...prev.about, title1: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">Title Part 2</label>
                      <input
                        type="text"
                        value={homepageData.about.title2}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          about: { ...prev.about, title2: e.target.value }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 mb-2 block">Subtitle</label>
                    <textarea
                      value={homepageData.about.subtitle}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        about: { ...prev.about, subtitle: e.target.value }
                      }))}
                      className="w-full p-4 border border-slate-200 rounded-xl h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">24h Turnaround</label>
                      <input
                        type="number"
                        value={homepageData.about.stats.hours}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            stats: { ...prev.about.stats, hours: parseInt(e.target.value) }
                          }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-600 mb-2 block">Success Rate %</label>
                      <input
                        type="number"
                        value={homepageData.about.stats.accuracy}
                        onChange={(e) => setHomepageData(prev => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            stats: { ...prev.about.stats, accuracy: parseInt(e.target.value) }
                          }
                        }))}
                        className="w-full p-4 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => saveSection('about', homepageData.about)}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2"
                  >
                    <FaSave size={14} />
                    Save About Changes
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 text-white p-8 rounded-2xl">
                  <div className="flex items-center gap-12">
                    <div className="flex-1">
                      <div className="text-6xl font-black uppercase mb-4">
                        {homepageData.about.title1} <span className="text-green-400">{homepageData.about.title2}</span>
                      </div>
                      <p className="text-slate-300 mb-8">{homepageData.about.subtitle}</p>
                      <div className="flex gap-12">
                        <div>
                          <div className="text-4xl font-black text-white">{homepageData.about.stats.hours}</div>
                          <div className="text-sm font-bold text-green-400 uppercase">Hour Turnaround</div>
                        </div>
                        <div>
                          <div className="text-4xl font-black text-white">{homepageData.about.stats.accuracy}%</div>
                          <div className="text-sm font-bold text-green-400 uppercase">Secure Filings</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-64 h-64 bg-slate-700 rounded-2xl overflow-hidden">
                      <img
                        src={homepageData.about.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
