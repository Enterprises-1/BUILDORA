
import React, { useState } from 'react';
import { Mail, Send, BadgeCheck, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    outcome: 'Enterprise Build',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.submitInquiry({
        businessName: formData.businessName,
        email: formData.email,
        outcome: formData.outcome,
        description: formData.description,
      });
      
      setSubmitted(true);
      setFormData({ businessName: '', email: '', outcome: 'Enterprise Build', description: '' });
    } catch (error) {
      console.error("Communication error during build request", error);
      alert("System communication error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Initiate Your <span className="text-primary italic">Cloud Build.</span></h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-12 font-light">
              Buildora executes limited high-fidelity engineering cycles each month. Provide your corporate profile to initiate a results-first analysis.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6 group">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5"><BadgeCheck /></div>
                <div>
                  <h4 className="text-white font-bold mb-1 uppercase tracking-tight">Zero Capital Risk</h4>
                  <p className="text-gray-400 text-sm font-medium">Performance-based delivery without upfront obligation.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5"><Mail /></div>
                <div>
                  <h4 className="text-white font-bold mb-1 uppercase tracking-tight">Direct Channel</h4>
                  <p className="text-gray-400 text-sm font-medium">ops@buildora.cloud</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background-surface border border-border-light p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
            
            {submitted ? (
              <div className="text-center py-20 animate-fade-in relative z-10">
                <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Project Initialized</h2>
                <p className="text-gray-400 mb-10 font-medium">Our architecture team has logged your profile. Expected response within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-primary font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Submit Secondary Node</button>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Firm Identity</label>
                    <input 
                      required
                      type="text" 
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all shadow-inner font-bold"
                      placeholder="Organization Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Corporate Email</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all shadow-inner font-bold"
                      placeholder="name@firm.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Engineering Vector</label>
                  <select 
                    value={formData.outcome}
                    onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                    className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all shadow-inner font-bold appearance-none cursor-pointer"
                  >
                    <option>Enterprise Build</option>
                    <option>Legacy Infrastructure Migration</option>
                    <option>High-Scale Commerce Engine</option>
                    <option>Bespoke Cloud Application</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Functional Requirements</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all shadow-inner font-bold resize-none"
                    placeholder="Briefly describe your current technical landscape and growth objectives."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'TRANSMITTING...' : <>SUBMIT REQUEST <Send size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
