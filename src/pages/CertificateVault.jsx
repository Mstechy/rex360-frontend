import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CertificateVault = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      // Fetches the 'clean and neat' data we created in Supabase
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setCerts(data);
      setLoading(false);
    };
    fetchVault();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* HEADER NODE */}
      <nav className="bg-[#0a192f] py-12 px-8 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
            <ArrowLeft size={14} /> Back to Bureau
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Verification <span className="text-[#10b981]">Vault.</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Doris Yuenva Benson • RC 142280</p>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {certs.map((cert) => (
            <motion.div 
              key={cert.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {cert.file_url ? (
                  <img src={cert.file_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={cert.title} />
                ) : (
                  <div className="text-center p-10">
                    <ShieldCheck size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Awaiting Verification</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0a192f]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={cert.file_url} target="_blank" rel="noreferrer" className="p-4 bg-[#10b981] rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              <div className="p-8">
                <span className="text-[9px] font-black text-[#10b981] uppercase tracking-[0.3em] mb-2 block">{cert.label}</span>
                <h3 className="text-xl font-black text-[#0a192f] uppercase mb-4">{cert.title}</h3>
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <p className="text-sm font-black text-slate-400 font-mono tracking-tighter">{cert.code}</p>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-[#10b981]">
                    <ShieldCheck size={12} /> Verified Agency
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CertificateVault;