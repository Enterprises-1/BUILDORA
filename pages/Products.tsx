
import React from 'react';
import { Eye, CheckCircle2, Zap, Layout, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-24">
          <span className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-6 block">Buildora Methodology</span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none uppercase">
            Engineering <br/> <span className="text-primary italic">Confidence.</span>
          </h1>
          <p className="text-gray-400 text-2xl font-light leading-relaxed">
            We reject the traditional agency payment cycle. Our "Speculative Build" protocol ensures zero capital risk by delivering high-fidelity results before the first invoice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-32">
          <div className="bg-background-surface border border-border-light p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full"></div>
            <Layout className="text-primary mb-10" size={48} />
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Marketplace Assets</h3>
            <p className="text-gray-400 mb-10 text-lg font-medium leading-relaxed">
              Explore our current inventory of ready-to-deploy digital infrastructure. These are high-performance builds crafted for specific industry sectors, available for immediate acquisition.
            </p>
            <ul className="space-y-4 mb-12">
              {['Immediate Cloud Deployment', 'Verified Performance Metrics', 'Corporate Ownership Transfer', 'Sector-Specific Logic'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300 font-bold uppercase text-xs tracking-widest">
                  <CheckCircle2 className="text-primary" size={16} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/available-websites" className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 group">
              Audit Inventory <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <Monitor className="text-white mb-10 opacity-40" size={48} />
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Bespoke Protocol</h3>
            <p className="text-gray-400 mb-10 text-lg font-medium leading-relaxed">
              For unique corporate requirements, we execute a speculative engineering cycle on your specific business profile. We build the complete solution upfront for your audit.
            </p>
            <ul className="space-y-4 mb-12">
              {['Custom Architecture Analysis', '48-Hour Speculative Build', 'Interactive Audit Link', 'Zero Capital Obligation'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-500 font-bold uppercase text-xs tracking-widest">
                  <CheckCircle2 className="text-white opacity-20" size={16} /> {item}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-background px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all shadow-xl group">
              Request Spec Build <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-[4rem] p-16 md:p-24 text-center max-w-5xl mx-auto shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <div className="relative z-10">
            <ShieldCheck className="text-primary mx-auto mb-10" size={56} />
            <h2 className="text-4xl font-black text-white mb-10 uppercase tracking-tighter">The Integrity Ledger</h2>
            <div className="grid md:grid-cols-3 gap-16 text-left">
              <div>
                <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Audit First</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">We prove technical superiority before any contract is discussed. You audit the live code and performance scores.</p>
              </div>
              <div>
                <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Full Equity</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Acquisition includes 100% ownership of source code, creative assets, and intellectual property nodes.</p>
              </div>
              <div>
                <h4 className="text-white font-black text-sm mb-4 uppercase tracking-widest">Edge Optimized</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Every Buildora build is engineered for global edge delivery, ensuring sub-second response times worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
