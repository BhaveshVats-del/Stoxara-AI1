
import React from 'react';
import { FEATURES } from '../constants';

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Built for the Modern Trader.
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Institutional power meets the simplicity of human speech. Stoxara processes millions of data points to give you the signal, not the noise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        {FEATURES.map((feature, idx) => (
          <div 
            key={idx}
            className={`group relative glass rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:border-white/20 hover:translate-y-[-4px] ${
              feature.size === 'lg' ? 'md:col-span-2' : 
              feature.size === 'md' ? 'md:col-span-1' : ''
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto p-3 rounded-2xl bg-white/5 border border-white/5 w-fit group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
            
            {/* Abstract visual elements */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="w-12 h-12 border-t-2 border-r-2 border-white rounded-tr-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
