
import React from 'react';
import { Target, ShieldCheck, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-32">
          <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Confidence Engineering</span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
            The agency that puts <span className="text-primary">skin in the game</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed font-light">
            Buildora was founded on a simple realization: Most businesses are tired of paying agencies for results they can't see yet. We build the work first because we know it's world-class.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center mb-40">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200" 
              alt="Buildora engineering team" 
              className="rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-700 relative z-10"
            />
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Value First</h3>
              <p className="text-gray-400 leading-relaxed">We don't pitch ideas. We build solutions. This ensures our clients always know exactly what they are getting before they commit a single dollar.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Global Reach</h3>
              <p className="text-gray-400 leading-relaxed">We serve ambitious brands globally with a focus on high-performance infrastructure and clean, conversion-focused design.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Pure Engineering</h3>
              <p className="text-gray-400 leading-relaxed">We are developers at heart. Every pixel and line of code is optimized for speed, security, and scalability.</p>
            </div>
          </div>
        </div>

        <div className="text-center bg-background-surface rounded-[4rem] p-20 border border-border-light">
          <h2 className="text-4xl font-black text-white mb-8 italic">"Payment should be a celebration of a job well done, not a leap of faith."</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest">— Julian Vance, Founder</p>
        </div>
      </div>
    </div>
  );
};

export default About;
