
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, LogOut, MousePointer2, Plus, Trash2, 
  MessageSquare, Palette, Check, X, Save, Settings, 
  DollarSign, Lock, Mail, ArrowUpRight, PlusSquare, 
  Upload, ClipboardList, Archive, Globe, PlusCircle, 
  TrendingUp, Zap, ArrowRight, Shield, Share2, Pencil,
  ChevronRight, RefreshCcw, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, BrandingConfig, Inquiry, NavigationLink, SocialLink } from '../types';
import { api } from '../services/api';
import { useBranding } from '../App';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { branding, refresh: refreshBranding } = useBranding();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'add-website' | 'inventory' | 'sold' | 'branding' | 'inquiries' | 'bids' | 'settings'>('dashboard');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [authPassword, setAuthPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFeatures, setEditFeatures] = useState('');
  
  // Branding Management State
  const [tempBranding, setTempBranding] = useState<BrandingConfig>(branding);
  
  // Deployment Form State
  const [newAsset, setNewAsset] = useState<{name: string, url: string, features: string, image: string, basePrice: string, previewMode: 'iframe' | 'redirect'}>({ 
    name: '', url: '', features: '', image: '', basePrice: '', previewMode: 'iframe' 
  });
  
  // Security Form State
  const [passUpdate, setPassUpdate] = useState({ old: '', new: '', confirm: '' });

  const loadData = async () => {
    const [prodData, inqData] = await Promise.all([
      api.getProducts(),
      api.getInquiries()
    ]);
    setProducts(prodData);
    setInquiries(inqData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = await api.getSession();
      if (session && session.expiresAt > Date.now()) {
        setIsLoggedIn(true);
        loadData();
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    setTempBranding(branding);
  }, [branding]);

  // LOGIN LOGIC
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await api.authenticate(authPassword);
    if (session) {
      setIsLoggedIn(true);
      loadData();
    } else {
      alert('Node Authentication Failed. Please check your credentials. (Default key is "admin")');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  // DEPLOY BUILD LOGIC
  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.url) return;
    setIsSubmitting(true);
    try {
      await api.addProduct({
        name: newAsset.name,
        demoUrl: newAsset.url,
        features: newAsset.features.split(',').map(f => f.trim()).filter(f => f !== ''),
        image: newAsset.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        previewMode: newAsset.previewMode,
        basePrice: parseFloat(newAsset.basePrice) || 0
      });
      setNewAsset({ name: '', url: '', features: '', image: '', basePrice: '', previewMode: 'iframe' });
      await loadData();
      setCurrentTab('inventory');
    } catch (err) {
      alert("Deployment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT PRODUCT LOGIC
  const startEditing = (p: Product) => {
    setEditingProduct(p);
    setEditFeatures(p.features.join(', '));
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      await api.updateProduct(editingProduct.id, {
        name: editingProduct.name,
        demoUrl: editingProduct.demoUrl,
        image: editingProduct.image,
        previewMode: editingProduct.previewMode,
        basePrice: editingProduct.basePrice,
        features: editFeatures.split(',').map(f => f.trim()).filter(f => f !== '')
      });
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      alert("System synchronization failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // MARKETPLACE & ARCHIVE LOGIC
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Terminate this infrastructure node from the ledger?")) {
      await api.deleteProduct(id);
      await loadData();
    }
  };

  const handleToggleSold = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    await api.updateProduct(id, { status: newStatus as any });
    await loadData();
  };

  // ACQUISITION BIDS LOGIC
  // Fix: Extended status type to include 'pending' to match Bid status types and resolve type error on line 480
  const handleBidAction = async (prodId: string, bidId: string, status: 'pending' | 'accepted' | 'rejected') => {
    await api.updateBidStatus(prodId, bidId, status);
    await loadData();
  };

  // LEADS LOGIC (REFINED)
  const handleTransmitInquiry = (inq: Inquiry) => {
    const subject = encodeURIComponent(`Regarding your ${inq.outcome} Inquiry - ${branding.companyName}`);
    const body = encodeURIComponent(`Hello ${inq.businessName},\n\nWe received your inquiry regarding "${inq.description}". Our architecture team is ready to discuss the engineering cycle for your project.\n\nBest regards,\nBuildora Ops`);
    window.location.href = `mailto:${inq.email}?subject=${subject}&body=${body}`;
  };

  const handleInquiryArchive = async (id: string) => {
    if (window.confirm("Archive this lead? This will remove the node from the active ledger.")) {
      try {
        await api.deleteInquiry(id);
        await loadData();
      } catch (e) {
        alert("Archival failed. System sync error.");
      }
    }
  };

  // BRANDING SYNC
  const handleBrandingSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await api.updateBranding(tempBranding);
    refreshBranding();
    alert('Global Identity Synchronized.');
  };

  // SOCIALS LOGIC
  const handleAddSocial = () => {
    const newSocials = [...(tempBranding.socialLinks || []), { id: Math.random().toString(36).substr(2, 9), platform: 'twitter' as any, url: '#' }];
    setTempBranding({ ...tempBranding, socialLinks: newSocials });
  };

  const handleRemoveSocial = (id: string) => {
    const newSocials = tempBranding.socialLinks.filter(s => s.id !== id);
    setTempBranding({ ...tempBranding, socialLinks: newSocials });
  };

  const handleSocialChange = (id: string, field: 'platform' | 'url', value: string) => {
    const newSocials = tempBranding.socialLinks.map(s => s.id === id ? { ...s, [field]: value } : s);
    setTempBranding({ ...tempBranding, socialLinks: newSocials });
  };

  // SECURITY LOGIC
  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passUpdate.new !== passUpdate.confirm) {
      alert("Verification keys do not match.");
      return;
    }
    const success = await api.updatePassword(passUpdate.old, passUpdate.new);
    if (success) {
      alert("Root Authorization rotated. Session updated.");
      setPassUpdate({ old: '', new: '', confirm: '' });
    } else {
      alert("Current access key is invalid.");
    }
  };

  // Aggregated Views
  const allBids = products.flatMap(p => (p.bids || []).map(b => ({ ...b, siteName: p.name, siteId: p.id, basePrice: p.basePrice })));
  const pendingBids = allBids.filter(b => b.status === 'pending');
  const grossRevenue = allBids.reduce((acc, b) => acc + (b.status === 'accepted' ? b.amount : 0), 0);
  const activeProducts = products.filter(p => p.status === 'available');
  const soldProducts = products.filter(p => p.status === 'sold');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full glass border border-border-light p-12 rounded-[3rem] shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="bg-primary p-4 rounded-3xl shadow-xl shadow-primary/20">
              <Lock className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Node Access</h1>
          <p className="text-center text-gray-500 text-sm mb-10 font-medium">Enterprise Administrative Layer</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              required 
              type="password" 
              autoFocus
              value={authPassword} 
              onChange={(e) => setAuthPassword(e.target.value)} 
              placeholder="Authorization Key" 
              className="w-full bg-background-surface border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary font-bold shadow-inner" 
            />
            <button className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all uppercase tracking-widest text-xs">Verify Credentials</button>
            <p className="text-center text-[9px] text-gray-700 uppercase tracking-widest">Default key is: admin</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      <aside className="w-full md:w-72 bg-background-surface border-r border-border-light flex flex-col shrink-0 z-50 shadow-2xl">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-xl group-hover:bg-primary-hover transition-colors shadow-lg">
              <MousePointer2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">{branding.companyName}</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1.5">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Intelligence' },
            { id: 'add-website', icon: <PlusSquare size={20} />, label: 'Deploy Build' },
            { id: 'inventory', icon: <ClipboardList size={20} />, label: 'Marketplace' },
            { id: 'sold', icon: <Archive size={20} />, label: 'Sold Archive' },
            { id: 'bids', icon: <DollarSign size={20} />, label: 'Acquisitions', badge: pendingBids.length },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Leads', badge: inquiries.length },
            { id: 'branding', icon: <Palette size={20} />, label: 'Brand Profile' },
            { id: 'settings', icon: <Settings size={20} />, label: 'Security' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${currentTab === tab.id ? 'bg-primary text-white shadow-xl' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
              {tab.badge ? <span className="ml-auto bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-border-light">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-16 overflow-y-auto">
        {currentTab === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tight">Intelligence</h2>
                <p className="text-gray-500 mt-2 font-medium">Core metrics for {branding.companyName} Global.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Portfolio Equity</p>
                <p className="text-3xl font-black text-white">${grossRevenue.toLocaleString()}</p>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Builds', val: activeProducts.length, icon: <Globe size={20} />, color: 'bg-blue-500' },
                { label: 'Pending Bids', val: pendingBids.length, icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
                { label: 'New Leads', val: inquiries.length, icon: <MessageSquare size={20} />, color: 'bg-orange-500' },
                { label: 'Sold Archive', val: soldProducts.length, icon: <Archive size={20} />, color: 'bg-purple-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-background-surface border border-border-light p-8 rounded-[2.5rem] shadow-xl">
                  <div className={`p-4 bg-white/5 rounded-2xl mb-6 w-fit text-white`}>{stat.icon}</div>
                  <h3 className="text-4xl font-black text-white mb-1">{stat.val}</h3>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'add-website' && (
          <div className="max-w-4xl animate-fade-in space-y-12">
            <header>
              <h2 className="text-5xl font-black text-white tracking-tight">Deploy Node</h2>
              <p className="text-gray-500 mt-2 font-medium">Initialize a new engineering build on the cloud ledger.</p>
            </header>
            <form onSubmit={handleAddAsset} className="grid lg:grid-cols-2 gap-12">
              <div className="bg-background-surface border border-border-light p-10 rounded-[3rem] space-y-8 shadow-2xl">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Build Identity</label>
                  <input required value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" placeholder="Solaris Corporate" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Iframe URL</label>
                  <input required value={newAsset.url} onChange={e => setNewAsset({...newAsset, url: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" placeholder="https://demo.io" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Floor Price (USD)</label>
                  <input required type="number" value={newAsset.basePrice} onChange={e => setNewAsset({...newAsset, basePrice: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" placeholder="15000" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Preview Protocol</label>
                  <select 
                    value={newAsset.previewMode}
                    onChange={e => setNewAsset({...newAsset, previewMode: e.target.value as 'iframe' | 'redirect'})}
                    className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="iframe">Iframe with Automatic Fallback</option>
                    <option value="redirect">Direct Tab Redirect</option>
                  </select>
                </div>
              </div>
              <div className="bg-background-surface border border-border-light p-10 rounded-[3rem] space-y-8 shadow-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Stack Keywords</label>
                  <input required value={newAsset.features} onChange={e => setNewAsset({...newAsset, features: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" placeholder="Next.js, Tailwind, 100 Page Speed" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Visual Atmosphere</label>
                  <div className="relative h-48 bg-background border-2 border-dashed border-border-light rounded-[2rem] flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                    {newAsset.image ? <img src={newAsset.image} className="w-full h-full object-cover" /> : <div className="text-center p-6"><Upload className="mx-auto text-gray-700 mb-2" size={32} /><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Upload Asset Image</p></div>}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewAsset({...newAsset, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  {isSubmitting ? 'ENGINEERING...' : <><PlusCircle size={20} /> Authorize Build</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {currentTab === 'inventory' && (
          <div className="space-y-12 animate-fade-in">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tight">Marketplace</h2>
                <p className="text-gray-500 mt-2 font-medium">Currently active engineering builds in global circulation.</p>
              </div>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeProducts.map(p => (
                <div key={p.id} className="bg-background-surface border border-border-light rounded-[2.5rem] overflow-hidden group shadow-xl flex flex-col">
                  <div className="h-56 relative overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                       <div className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">Live Node</div>
                       <div className="bg-black/50 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-white/10">
                         {p.previewMode === 'iframe' ? 'Iframe Mode' : 'Direct Redirect'}
                       </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-white font-black text-xl uppercase tracking-tighter">{p.name}</h4>
                      <p className="text-primary font-black text-sm">${(p.basePrice || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <button onClick={() => handleToggleSold(p.id, p.status)} className="flex-1 bg-white/5 border border-border-light text-white text-[10px] font-black py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Mark Sold</button>
                      <button onClick={() => startEditing(p)} className="p-4 text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-all">
                        <Settings size={18} />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-4 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {activeProducts.length === 0 && <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[4rem] text-center"><Globe size={48} className="mx-auto text-gray-800 mb-4" /><p className="text-gray-600 font-black uppercase tracking-widest">No active builds detected.</p></div>}
            </div>
          </div>
        )}

        {currentTab === 'bids' && (
          <div className="space-y-12 animate-fade-in">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tight">Acquisitions</h2>
                <p className="text-gray-500 mt-2 font-medium">Review and verify investment proposals for cloud infrastructure.</p>
              </div>
            </header>
            <div className="bg-background-surface border border-border-light rounded-[3rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-10 py-8">Source Officer</th>
                    <th className="px-10 py-8">Target Asset</th>
                    <th className="px-10 py-8">Bid Status</th>
                    <th className="px-10 py-8">Capital Delta</th>
                    <th className="px-10 py-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allBids.map(bid => {
                    const profit = bid.amount - (bid.basePrice || 0);
                    const isProfit = profit >= 0;
                    
                    return (
                      <tr key={bid.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-10 py-8">
                          <p className="text-white font-black text-base">{bid.clientName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{bid.clientEmail}</p>
                            <a href={`mailto:${bid.clientEmail}`} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={10} /></a>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-gray-400 font-bold text-sm uppercase">{bid.siteName}</p>
                          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">Floor: ${bid.basePrice?.toLocaleString()}</p>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-white">${bid.amount.toLocaleString()}</span>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md mt-1 w-fit ${bid.status === 'accepted' ? 'bg-green-500/10 text-green-500' : bid.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>{bid.status}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-1 font-mono text-xs font-black ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                            {isProfit ? '+' : '-'}${Math.abs(profit).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          {bid.status === 'pending' ? (
                            <div className="flex justify-end gap-3">
                              <button onClick={() => handleBidAction(bid.siteId, bid.id, 'accepted')} className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500/20 transition-all shadow-lg"><Check size={20} /></button>
                              <button onClick={() => handleBidAction(bid.siteId, bid.id, 'rejected')} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all shadow-lg"><X size={20} /></button>
                            </div>
                          ) : (
                            <button onClick={() => handleBidAction(bid.siteId, bid.id, 'pending')} className="p-3 text-gray-600 hover:text-white transition-colors"><RefreshCcw size={16} /></button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {allBids.length === 0 && <tr><td colSpan={5} className="px-10 py-32 text-center text-gray-600 font-black uppercase tracking-widest italic">No proposals logged in system.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ... Other tabs (sold, inquiries, branding, settings) remain unchanged ... */}
        {currentTab === 'sold' && (
          <div className="space-y-12 animate-fade-in">
            <header>
              <h2 className="text-5xl font-black text-white tracking-tight">Sold Archive</h2>
              <p className="text-gray-500 mt-2 font-medium">Historical engineering nodes fully acquired by corporate partners.</p>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {soldProducts.map(p => (
                <div key={p.id} className="bg-background-surface border border-border-light rounded-[2.5rem] overflow-hidden grayscale opacity-60 shadow-xl flex flex-col">
                  <div className="h-56 relative overflow-hidden"><img src={p.image} className="w-full h-full object-cover" /></div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="text-white font-black text-xl mb-6 uppercase tracking-tighter">{p.name}</h4>
                    <button onClick={() => handleToggleSold(p.id, p.status)} className="w-full bg-white/5 border border-border-light text-white text-[10px] font-black py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Re-Activate Node</button>
                  </div>
                </div>
              ))}
              {soldProducts.length === 0 && <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-[4rem] text-center"><Archive size={48} className="mx-auto text-gray-800 mb-4" /><p className="text-gray-600 font-black uppercase tracking-widest">Archive empty.</p></div>}
            </div>
          </div>
        )}

        {currentTab === 'inquiries' && (
          <div className="space-y-12 animate-fade-in">
            <header>
              <h2 className="text-5xl font-black text-white tracking-tight">Leads</h2>
              <p className="text-gray-500 mt-2 font-medium">Bespoke build requests and corporate inquiries.</p>
            </header>
            <div className="grid gap-8">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-background-surface border border-border-light p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row justify-between gap-10">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-6">
                      <div className="bg-primary/10 p-5 rounded-3xl text-primary"><Mail size={24} /></div>
                      <div>
                        <h4 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">{inq.businessName}</h4>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-2">{inq.email} • {inq.date}</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-3xl p-8 border border-white/5">
                      <p className="text-[10px] font-black uppercase text-primary mb-4 tracking-[0.4em]">{inq.outcome}</p>
                      <p className="text-gray-400 text-base leading-relaxed font-medium">{inq.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end gap-4">
                    <button 
                      onClick={() => handleTransmitInquiry(inq)}
                      className="bg-primary hover:bg-primary-hover text-white px-8 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl"
                    >
                      Transmit <ArrowUpRight size={18} />
                    </button>
                    <button 
                      onClick={() => handleInquiryArchive(inq.id)} 
                      className="bg-white/5 border border-border-light text-gray-600 px-8 py-5 rounded-2xl hover:text-red-500 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <Trash2 size={18} /> Archive
                    </button>
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && <div className="py-40 border-2 border-dashed border-white/5 rounded-[4rem] text-center"><MessageSquare size={48} className="mx-auto text-gray-800 mb-4" /><p className="text-gray-600 font-black uppercase tracking-widest">Inbound ledger is clear.</p></div>}
            </div>
          </div>
        )}

        {currentTab === 'branding' && (
          <div className="animate-fade-in space-y-12 pb-20">
            <header><h2 className="text-5xl font-black text-white tracking-tight">Brand Profile</h2><p className="text-gray-500 mt-2 font-medium">Coordinate corporate identity and social media nodes.</p></header>
            <div className="grid lg:grid-cols-2 gap-12">
              <form onSubmit={handleBrandingSave} className="bg-background-surface border border-border-light p-10 rounded-[3rem] space-y-8 shadow-2xl">
                <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Firm Identity</label><input value={tempBranding.companyName} onChange={e => setTempBranding({...tempBranding, companyName: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Logo Node</label><div className="relative h-32 bg-background border border-border-light rounded-2xl overflow-hidden group cursor-pointer">{tempBranding.logoUrl ? <img src={tempBranding.logoUrl} className="w-full h-full object-contain p-4" /> : <div className="flex flex-col items-center justify-center h-full text-gray-700 uppercase font-black text-[8px] tracking-widest"><Upload size={20} className="mb-2" /> Upload</div>}<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setTempBranding({...tempBranding, logoUrl: reader.result as string}); reader.readAsDataURL(file); } }} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div>
                  <div className="space-y-3"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Atmosphere</label><div className="relative h-32 bg-background border border-border-light rounded-2xl overflow-hidden group cursor-pointer">{tempBranding.bannerUrl ? <img src={tempBranding.bannerUrl} className="w-full h-full object-cover opacity-50" /> : <div className="flex flex-col items-center justify-center h-full text-gray-700 uppercase font-black text-[8px] tracking-widest"><Upload size={20} className="mb-2" /> Upload</div>}<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setTempBranding({...tempBranding, bannerUrl: reader.result as string}); reader.readAsDataURL(file); } }} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-2xl font-black shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"><Save size={18} /> Sync Visual Identity</button>
              </form>
              <div className="bg-background-surface border border-border-light p-10 rounded-[3rem] shadow-2xl flex flex-col h-fit">
                <div className="flex items-center justify-between mb-8"><h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2"><Share2 size={18} className="text-primary" /> Social Nodes</h3><button onClick={handleAddSocial} className="text-primary hover:text-white transition-colors"><PlusCircle size={24} /></button></div>
                <div className="space-y-4">{tempBranding.socialLinks.map(social => (<div key={social.id} className="bg-background border border-border-light rounded-2xl p-5 flex items-center gap-4 group"><select value={social.platform} onChange={e => handleSocialChange(social.id, 'platform', e.target.value)} className="bg-transparent text-white font-black text-xs uppercase tracking-widest outline-none border-r border-white/10 pr-4"><option value="twitter">Twitter</option><option value="linkedin">LinkedIn</option><option value="github">Github</option><option value="facebook">Facebook</option><option value="instagram">Instagram</option></select><input value={social.url} onChange={e => handleSocialChange(social.id, 'url', e.target.value)} className="flex-1 bg-transparent text-gray-500 font-bold text-[10px] outline-none" placeholder="Target URL" /><button onClick={() => handleRemoveSocial(social.id)} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div>))}</div>
                <button onClick={() => handleBrandingSave()} className="w-full mt-8 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3"><Save size={18} /> Sync Social Infrastructure</button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in space-y-12">
             <header><h2 className="text-5xl font-black text-white tracking-tight">Security</h2><p className="text-gray-500 mt-2 font-medium">Rotate system authorization keys and manage root access protocols.</p></header>
             <div className="bg-background-surface border border-border-light p-12 rounded-[3rem] space-y-10 shadow-2xl">
                <div className="flex items-start gap-6 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl"><Shield className="text-red-500 shrink-0 mt-1" size={24} /><div className="space-y-1"><h4 className="text-red-500 font-black text-xs uppercase tracking-widest">Protocol Warning</h4><p className="text-xs text-red-400 font-bold leading-relaxed opacity-80 uppercase">Key rotation will immediately update the root authorization ledger.</p></div></div>
                <form onSubmit={handleSecurityUpdate} className="space-y-6">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Current Authorization Key</label><input required type="password" value={passUpdate.old} onChange={e => setPassUpdate({...passUpdate, old: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-inner" /></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">New Identity Key</label><input required type="password" value={passUpdate.new} onChange={e => setPassUpdate({...passUpdate, new: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-inner" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Confirm New Key</label><input required type="password" value={passUpdate.confirm} onChange={e => setPassUpdate({...passUpdate, confirm: e.target.value})} className="w-full bg-background border border-border-light rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-primary transition-all font-bold shadow-inner" /></div>
                  </div>
                  <button type="submit" className="w-full bg-white text-background py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"><Zap size={20} className="text-primary" /> Rotate System Key</button>
                </form>
             </div>
          </div>
        )}
      </main>

      {/* ASSET CONFIGURATION ENGINE (EDIT MODAL) */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-4xl w-full bg-background-surface border border-border-light rounded-[3rem] shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setEditingProduct(null)}
              className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>
            
            <div className="p-12 md:p-16">
              <header className="mb-12">
                <span className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">Asset Configuration</span>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Modify Infrastructure Node</h2>
                <p className="text-gray-500 mt-4 text-sm font-medium">Update identities, deployment URLs, and stack parameters for "{editingProduct.name}".</p>
              </header>

              <form onSubmit={handleUpdateProduct} className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Build Identity</label>
                    <input 
                      required 
                      value={editingProduct.name} 
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Iframe URL</label>
                    <input 
                      required 
                      value={editingProduct.demoUrl} 
                      onChange={e => setEditingProduct({...editingProduct, demoUrl: e.target.value})} 
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Floor Price (USD)</label>
                    <input 
                      required 
                      type="number"
                      value={editingProduct.basePrice} 
                      onChange={e => setEditingProduct({...editingProduct, basePrice: parseFloat(e.target.value)})} 
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Preview Protocol</label>
                    <select 
                      value={editingProduct.previewMode}
                      onChange={e => setEditingProduct({...editingProduct, previewMode: e.target.value as 'iframe' | 'redirect'})}
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="iframe">Iframe with Automatic Fallback</option>
                      <option value="redirect">Direct Tab Redirect</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Stack Keywords</label>
                    <input 
                      required 
                      value={editFeatures} 
                      onChange={e => setEditFeatures(e.target.value)} 
                      className="w-full bg-background border border-border-light rounded-2xl px-6 py-4 text-white focus:border-primary focus:outline-none transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Visual Atmosphere</label>
                    <div className="relative h-48 bg-background border-2 border-dashed border-border-light rounded-[2rem] flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                      {editingProduct.image ? (
                        <img src={editingProduct.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-6">
                          <Upload className="mx-auto text-gray-700 mb-2" size={32} />
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Update Asset Image</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditingProduct({...editingProduct, image: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 bg-white/5 border border-border-light text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                    >
                      Cancel Changes
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black shadow-2xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isSubmitting ? (
                        <RefreshCcw className="animate-spin" size={18} />
                      ) : (
                        <><Save size={18} /> Synchronize Node</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
