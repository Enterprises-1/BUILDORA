import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MousePointer2, Github, Linkedin, Twitter, Lock, 
  Facebook, Instagram, ArrowRight, Shield, Globe 
} from 'lucide-react';
import { useBranding } from '../App';

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'twitter': return <Twitter size={18} />;
    case 'linkedin': return <Linkedin size={18} />;
    case 'github': return <Github size={18} />;
    case 'facebook': return <Facebook size={18} />;
    case 'instagram': return <Instagram size={18} />;
    default: return <Globe size={18} />;
  }
};

const Footer: React.FC = () => {
  const { branding } = useBranding();

  return (
    <footer className="bg-background-surface border-t border-border-light pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <div className="bg-primary p-2.5 rounded-xl group-hover:bg-primary-hover transition-colors shadow-lg">
              <MousePointer2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">{branding.companyName}</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium max-w-sm">
            Result-first web engineering for ambitious firms globally. We deploy high-performance infrastructure first, proving value through live audit links.
          </p>
          <div className="flex gap-5">
            {branding.socialLinks.map((social) => (
              <a 
                key={social.id} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors p-2 bg-white/5 rounded-lg hover:bg-white/10"
              >
                <SocialIcon platform={social.platform} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Platform</h4>
          <ul className="space-y-6 text-sm text-gray-500 font-bold">
            <li><Link to="/services" className="hover:text-primary transition-colors">Architecture</Link></li>
            <li><Link to="/available-websites" className="hover:text-primary transition-colors">Marketplace</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Initiate Build</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Firm</h4>
          <ul className="space-y-6 text-sm text-gray-500 font-bold">
            <li><Link to="/about" className="hover:text-primary transition-colors">Philosophy</Link></li>
            <li><Link to="/ethics" className="hover:text-primary transition-colors">Engineering Ethics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Legal</h4>
          <ul className="space-y-6 text-sm text-gray-500 font-bold">
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Infrastructure</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Operations</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 border-t border-border-light pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-600">
        <div className="flex items-center gap-3">
          <p>© 2026 {branding.companyName} GLOBAL. ZERO RISK. RESULTS FIRST.</p>
          <Link to="/admin" className="text-gray-900/50 hover:text-primary transition-all p-1" title="Node Console">
            <Lock size={12} />
          </Link>
        </div>
        <div className="flex gap-10">
          <span className="text-gray-800">PRECISION UI V4.0</span>
          <span className="text-gray-800">DISTRIBUTED EDGE NODES</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;