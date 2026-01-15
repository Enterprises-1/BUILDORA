import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MousePointer2, Home as HomeIcon } from 'lucide-react';
import { useBranding } from '../App';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { branding } = useBranding();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'glass border-b border-border-light py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.companyName} className="h-10 w-auto" />
          ) : (
            <div className="bg-primary p-2.5 rounded-xl group-hover:bg-primary-hover transition-colors shadow-lg">
              <MousePointer2 className="text-white w-6 h-6" />
            </div>
          )}
          <span className="text-2xl font-black tracking-tighter text-white uppercase">{branding.companyName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-white flex items-center gap-2 ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}
          >
            <HomeIcon size={12} />
            Home
          </Link>

          {branding.links.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-white flex items-center gap-2 ${location.pathname === link.path ? 'text-primary' : 'text-gray-500'}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          
          <Link
            to="/contact"
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
          >
            Start Build
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-background/95 backdrop-blur-xl z-[200] transition-all duration-500 flex flex-col items-center justify-center gap-8 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button className="absolute top-8 right-8 text-white p-2" onClick={() => setIsOpen(false)}>
          <X size={32} />
        </button>
        
        <Link
          to="/"
          className={`text-3xl font-black uppercase tracking-tighter ${location.pathname === '/' ? 'text-primary' : 'text-white'}`}
        >
          Home
        </Link>

        {branding.links.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            className={`text-3xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-primary' : 'text-white'}`}
          >
            {link.label}
          </Link>
        ))}
        
        <Link
          to="/contact"
          className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl"
        >
          Start Build
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;