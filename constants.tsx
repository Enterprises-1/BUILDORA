
import React from 'react';
import { 
  CheckCircle, 
  Target, 
  Award,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Globe
} from 'lucide-react';

export const CORE_VALUES = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Confidence Engineering',
    description: 'We deploy the complete infrastructure before capital commitment. Performance is verified, not promised.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Results Primary',
    description: 'Our engineering cycles lead with business value. We solve conversion and speed challenges before the first conversation.'
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Elite Protocol',
    description: 'Next-gen cloud stacks only. Every Buildora build is optimized for 100/100 performance scores and enterprise security.'
  }
];

export const STEPS = [
  { title: 'Analysis', description: 'Deep audit of industry digital benchmarks and performance gaps.' },
  { title: 'Engineering', description: 'Bespoke high-fidelity build deployment on globally distributed edge nodes.' },
  { title: 'Verification', description: 'Live audit session of the finished result—interactive and fully functional.' },
  { title: 'Acquisition', description: 'Seamless ownership transfer once the build meets all performance metrics.' }
];

export const STACK = [
  'Next.js 15', 
  'Cloudflare Workers', 
  'TypeScript', 
  'PostgreSQL', 
  'Tailwind Engine', 
  'Edge Rendering', 
  'Redis Cache', 
  'Precision UI'
];
