
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, BadgeCheck } from 'lucide-react';
import { CORE_VALUES } from '../constants';
import { BrandingConfig } from '../types';

interface HomeProps {
  branding: BrandingConfig;
}

const Home: React.FC<HomeProps> = ({ branding }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        {branding.bannerUrl ? (
          <div className="absolute inset-0 z-0">
            <img src={branding.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
          </div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, #1258e2 0%, transparent 60%)' }}></div>
        )}
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-8 animate-fade-in uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            The Result-First Web Agency
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            We build it <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">first.</span> <br/>
            You pay only if you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">love it.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            No deposits. No risk. We design and develop complete websites upfront. Browse our available inventory or request a custom build.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link 
              to="/available-websites" 
              className="bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-primary/20 flex items-center gap-2 group"
            >
              Browse Inventory
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="glass border border-border-light text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/5 transition-all flex items-center gap-2"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Icons */}
      <section className="py-12 border-y border-border-light bg-background-surface/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 text-sm font-bold text-white"><ShieldCheck className="w-5 h-5 text-primary" /> SECURE DEPLOYMENT</div>
             <div className="flex items-center gap-2 text-sm font-bold text-white"><BadgeCheck className="w-5 h-5 text-primary" /> ZERO UPFRONT RISK</div>
             <div className="flex items-center gap-2 text-sm font-bold text-white"><CheckCircle className="text-primary w-5 h-5" /> SCALE-READY CODE</div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Why {branding.companyName}?</span>
              <h2 className="text-6xl font-black text-white leading-tight mb-8">
                We take the <span className="italic text-gray-500 font-medium text-3xl">financial risk</span> so you don't have to.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Most agencies ask for 50% upfront for a promise. We give you the result first. If you don't like what we build, you walk away with zero obligations.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle className="text-primary" size={18} />
                  Professional designs ready in days
                </div>
                <div className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle className="text-primary" size={18} />
                  Full ownership upon purchase
                </div>
                <div className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle className="text-primary" size={18} />
                  Live demo links for every project
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
              {CORE_VALUES.map((val, idx) => (
                <div key={idx} className="bg-background-surface p-8 rounded-2xl border border-border-light hover:border-primary/50 transition-all group">
                  <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {val.icon}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 bg-primary overflow-hidden relative text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-7xl font-black text-white mb-10 leading-tight">No more paying for promises.</h2>
          <Link 
            to="/available-websites" 
            className="inline-block bg-white text-primary px-12 py-6 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            Explore the Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
