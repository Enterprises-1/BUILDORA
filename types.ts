
export interface NavigationLink {
  id: string;
  label: string;
  path: string;
}

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'linkedin' | 'github' | 'facebook' | 'instagram';
  url: string;
}

export interface Product {
  id: string;
  name: string;
  features: string[];
  demoUrl: string;
  image: string;
  status: 'available' | 'sold';
  deploymentDate: string;
  bids: Bid[];
  previewMode: 'iframe' | 'redirect'; // Support for enterprise security constraints
}

export interface Bid {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Inquiry {
  id: string;
  businessName: string;
  email: string;
  outcome: string;
  description: string;
  date: string;
}

export interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  bannerUrl: string;
  links: NavigationLink[];
  socialLinks: SocialLink[];
}

export interface AuthSession {
  token: string;
  expiresAt: number;
}
