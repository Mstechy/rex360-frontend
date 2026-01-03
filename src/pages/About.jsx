import { motion } from 'framer-motion';
import { Award, ShieldCheck, Zap, Globe, Briefcase } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Narrative Section */}
      <section className="pt-40 pb-20 px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-green-600 font-black text-xs uppercase tracking-[0.5em] mb-6 block">The Architect’s Vision</span>
              <h1 className="text-6xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-10">
                Beyond <br /> <span className="text-slate-300">Registration</span>
              </h1>
              <div className="space-y-6 text-slate-600 text-lg font-medium leading-relaxed">
                <p>REX360 Solutions was founded on a singular principle: Professional integrity in corporate compliance. As an accredited agent with the Corporate Affairs Commission, I saw the need for a system that combines legal expertise with modern technology.</p>
                <p>We don't just "register names"—we birth legal entities. From the drafting of the Memorandum of Association to the issuance of the Tax Identification Number, every step is calculated for long-term corporate success.</p>
              </div>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[4rem] bg-slate-900 overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000" className="w-full h-full object-cover grayscale" alt="CEO REX360" />
               </div>
               {/* Floating Credentials */}
               <div className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                  <Award size={40} className="text-green-600 mb-2"/>
                  <p className="font-black text-xs uppercase tracking-widest">Accredited Agent</p>
                  <p className="text-[10px] text-slate-400 font-bold">RC 142280</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-8 grid md:grid-cols-3 gap-12">
           {[
             { title: "Direct Portal Access", desc: "No middle-men. Your data goes from our secure server directly to the CAC registry.", icon: <Zap className="text-green-600"/> },
             { title: "Legal Precision", desc: "Our constitutional drafts are vetted to ensure compliance with the CAMA 2020 Act.", icon: <ShieldCheck className="text-blue-600"/> },
             { title: "Post-Incorp. Support", desc: "We stay with you for Annual Returns, Shareholder changes, and corporate scaling.", icon: <Globe className="text-violet-600"/> },
           ].map((item, i) => (
             <div key={i} className="p-12 bg-white rounded-[3rem] shadow-sm hover:shadow-xl transition-all">
                <div className="mb-6">{item.icon}</div>
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default About;