
import React from 'react';
import { TrendingUp, Activity, Shield, Zap, Globe } from 'lucide-react';

export const COLORS = {
  navy: '#020617',
  electricBlue: '#3b82f6',
  emeraldGreen: '#10b981',
};

export const FEATURES = [
  {
    title: 'Macro Intelligence',
    description: 'Real-time global news sentiment analysis scaled to institutional levels.',
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    size: 'lg',
    gradient: 'from-emerald-500/10 to-transparent'
  },
  {
    title: 'Market Indicators',
    description: 'Instant interpretation of complex economic signals and data points.',
    icon: <Activity className="w-6 h-6 text-blue-400" />,
    size: 'sm',
    gradient: 'from-blue-500/10 to-transparent'
  },
  {
    title: 'Risk Modeling',
    description: 'Advanced volatility modeling and risk assessment via natural conversation.',
    icon: <Shield className="w-6 h-6 text-indigo-400" />,
    size: 'sm',
    gradient: 'from-indigo-500/10 to-transparent'
  },
  {
    title: 'Strategic Insights',
    description: 'Bridge the gap between raw data and actionable financial strategy.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    size: 'md',
    gradient: 'from-yellow-500/10 to-transparent'
  },
  {
    title: 'Global Trends',
    description: 'Analyze cross-asset correlations across all major international markets.',
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    size: 'md',
    gradient: 'from-purple-500/10 to-transparent'
  }
];
