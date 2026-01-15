
import { Product, BrandingConfig, Inquiry, Bid, AuthSession, NavigationLink, SocialLink } from '../types';

/**
 * Buildora Enterprise API Service
 * Centralized data layer designed for seamless transition from 
 * client-side mocking to enterprise cloud backend integration.
 */

const DEFAULT_LINKS: NavigationLink[] = [
  { id: '1', label: 'Architecture', path: '/services' },
  { id: '2', label: 'Marketplace', path: '/available-websites' },
  { id: '3', label: 'Philosophy', path: '/about' },
  { id: '4', label: 'Contact', path: '/contact' },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: 's1', platform: 'twitter', url: '#' },
  { id: 's2', platform: 'linkedin', url: '#' },
  { id: 's3', platform: 'github', url: '#' },
];

const INITIAL_BRANDING: BrandingConfig = {
  companyName: 'Buildora',
  logoUrl: '',
  bannerUrl: '',
  links: DEFAULT_LINKS,
  socialLinks: DEFAULT_SOCIALS
};

class ApiService {
  private static instance: ApiService;
  private storageKey = 'buildora_system_v1_';

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // --- PERSISTENCE ABSTRACTION ---
  private async get<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(this.storageKey + key);
    if (!data) return null;
    try {
      // Attempt to parse as JSON first
      return JSON.parse(data) as T;
    } catch (e) {
      // If it fails, return the raw data as requested type (handles legacy raw strings)
      return data as unknown as T;
    }
  }

  private async save(key: string, data: any): Promise<void> {
    // Always stringify for consistency in our system
    localStorage.setItem(this.storageKey + key, JSON.stringify(data));
    // Crucial: emit event so other tabs/components sync
    window.dispatchEvent(new Event('storage'));
  }

  // --- AUTHENTICATION & SECURITY ---
  async authenticate(password: string): Promise<AuthSession | null> {
    const input = (password || '').trim();
    const storedPass = await this.get<string>('admin_pass') || 'admin';
    
    // Exact match check (trimming input to avoid common copy-paste space errors)
    if (input === storedPass) {
      const session = { 
        token: btoa(Math.random().toString() + Date.now()), 
        expiresAt: Date.now() + 86400000 // 24h session
      };
      await this.save('session', session);
      return session;
    }
    return null;
  }

  async updatePassword(oldPass: string, newPass: string): Promise<boolean> {
    const storedPass = await this.get<string>('admin_pass') || 'admin';
    if (oldPass.trim() === storedPass) {
      await this.save('admin_pass', newPass.trim());
      // After password update, we refresh the session
      await this.authenticate(newPass.trim());
      return true;
    }
    return false;
  }

  async getSession(): Promise<AuthSession | null> {
    return await this.get<AuthSession>('session');
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.storageKey + 'session');
    window.dispatchEvent(new Event('storage'));
  }

  // --- BRANDING ENGINE ---
  async getBranding(): Promise<BrandingConfig> {
    const stored = await this.get<BrandingConfig>('branding');
    if (!stored || typeof stored !== 'object') return INITIAL_BRANDING;
    // Migration logic for old stored versions
    return { 
      ...INITIAL_BRANDING, 
      ...stored, 
      links: stored.links || DEFAULT_LINKS,
      socialLinks: stored.socialLinks || DEFAULT_SOCIALS
    };
  }

  async updateBranding(config: BrandingConfig): Promise<void> {
    await this.save('branding', config);
  }

  // --- PRODUCT MANAGEMENT ---
  async getProducts(): Promise<Product[]> {
    const products = (await this.get<Product[]>('products')) || [];
    // Ensure all products have a previewMode and basePrice
    return Array.isArray(products) ? products.map(p => ({ 
      ...p, 
      previewMode: p.previewMode || 'iframe',
      basePrice: p.basePrice || 0,
      bids: p.bids || []
    })) : [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    const p = products.find(p => p.id === id) || null;
    return p;
  }

  async addProduct(product: Omit<Product, 'id' | 'deploymentDate' | 'bids' | 'status'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      deploymentDate: new Date().toLocaleDateString(),
      status: 'available',
      bids: [],
      basePrice: product.basePrice || 0,
      previewMode: product.previewMode || 'iframe'
    };
    await this.save('products', [newProduct, ...products]);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const products = await this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    await this.save('products', updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    await this.save('products', products.filter(p => p.id !== id));
  }

  // --- ACQUISITION BIDDING ---
  async submitBid(productId: string, bidData: Omit<Bid, 'id' | 'date' | 'status'>): Promise<void> {
    const products = await this.getProducts();
    const newBid: Bid = {
      ...bidData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };

    const updated = products.map(p => {
      if (p.id === productId) {
        return { ...p, bids: [...(p.bids || []), newBid] };
      }
      return p;
    });
    await this.save('products', updated);
  }

  // Fix: Extended status type to include 'pending' to handle bid resets and ensure consistent p.status logic
  async updateBidStatus(productId: string, bidId: string, status: 'pending' | 'accepted' | 'rejected'): Promise<void> {
    const products = await this.getProducts();
    const updated = products.map(p => {
      if (p.id === productId) {
        const updatedBids = p.bids.map(b => b.id === bidId ? { ...b, status } : b);
        // A product is 'sold' if any bid is currently accepted
        const isAnyAccepted = updatedBids.some(b => b.status === 'accepted');
        const newStatus = isAnyAccepted ? 'sold' : 'available';
        return { ...p, bids: updatedBids, status: newStatus as any };
      }
      return p;
    });
    await this.save('products', updated);
  }

  // --- CRM / INQUIRIES ---
  async getInquiries(): Promise<Inquiry[]> {
    const inq = await this.get<Inquiry[]>('inquiries');
    return Array.isArray(inq) ? inq : [];
  }

  async submitInquiry(inquiry: Omit<Inquiry, 'id' | 'date'>): Promise<void> {
    const inquiries = await this.getInquiries();
    const newInq: Inquiry = {
      ...inquiry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString()
    };
    await this.save('inquiries', [newInq, ...inquiries]);
  }

  async deleteInquiry(id: string): Promise<void> {
    const inquiries = await this.getInquiries();
    await this.save('inquiries', inquiries.filter(i => i.id !== id));
  }
}

export const api = ApiService.getInstance();
