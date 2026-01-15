
import React from 'react';
import { Shield, Rocket, Monitor, ShieldCheck, Search, Code2, MousePointer2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const steps = [
    {
      icon: <Search className="text-primary" size={32} />,
      title: "Business Audit",
      description: "We analyze your current presence (or lack thereof) and identify the biggest opportunities for growth."
    },
    {
      icon: <Code2 className="text-primary" size={32} />,
      title: "Speculative Build",
      description: "Our engineers spend 24-72 hours building a high-fidelity prototype of your new website."
    },
    {
      icon: <Monitor className="text-primary" size={32} />,
      title: "The Presentation",
      description: "We show you exactly what we've built. You get a live link to interact with the site."
    },
    {
      icon: <CreditCard className="text-primary" size={32} />,
      title: "Zero-Risk Handover",
      description: "If you love it, we agree on a price. If not, we part ways with no hard feelings."
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Our Unique Method</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
              A Transparent <span className="text-primary">Way to Build</span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-10 font-light">
              We flipped the script on traditional agency models. By building first, we eliminate the risk for our clients and prove our quality before we ever ask for payment.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all">
                Request a Build
              </Link>
              <Link to="/about" className="border border-border-light text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="relative z-10 bg-background-surface border border-border-light p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-auto text-xs text-gray-500 font-mono tracking-tighter">B_INFRA_MONITOR.SYS</div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
                    <div className="h-32 bg-primary/20 rounded-xl w-full flex items-center justify-center">
                        <MousePointer2 className="text-primary w-8 h-8" />
                    </div>
                    <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                    <div className="h-4 bg-white/5 rounded-lg w-5/6"></div>
                </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {steps.map((f, i) => (
            <div key={i} className="bg-background-surface p-10 rounded-3xl border border-border-light hover:border-primary/50 transition-colors group">
              <div className="mb-8 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-background-surface/50 border border-border-light rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] rounded-full"></div>
          <div className="max-w-3xl relative z-10">
            <h2 className="text-4xl font-black text-white mb-8">Technical Confidence</h2>
            <p className="text-gray-400 mb-12">We use an elite tech stack because we know it works. By sticking to high-performance frameworks, we can build faster and better than the competition.</p>
            <div className="flex flex-wrap gap-8 opacity-60">
              {['Next.js', 'Vercel', 'TypeScript', 'Tailwind', 'Postgres', 'Edge Runtime', 'Clerk Auth', 'Stripe'].map((tech) => (
                <span key={tech} className="text-2xl font-bold text-white tracking-tight">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
