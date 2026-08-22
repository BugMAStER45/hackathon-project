import React from 'react';
import { Flame, Map, Shield, Droplet, ArrowRight } from 'lucide-react';

function FeatureItem({ icon, text, color }) {
  return (
    <div className="flex items-center gap-6 group">
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900/50 border transition-all duration-300"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: color, boxShadow: `0 0 20px ${color}20` }}
      >
        {icon}
      </div>
      <span style={{ 
        fontFamily: 'Bebas Neue,sans-serif', fontSize: '32px', letterSpacing: '3px', 
        color: 'var(--text)', textShadow: '0 0 10px rgba(255,255,255,0.1)' 
      }}>
        {text}
      </span>
    </div>
  );
}

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#000000' }}>
      {/* Cinematic glowing background orbs (Kept theme intact) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 animate-fade-slide" style={{ animationDuration: '0.8s' }}>
        
        {/* TITLE & SLOGAN */}
        <div className="mb-20">
          <h1 className="aurora-text" style={{ 
            fontFamily: 'Bebas Neue,sans-serif', fontSize: '110px', letterSpacing: '12px', 
            lineHeight: 1, margin: 0
          }}>
            AEGIS-OASIS
          </h1>
          <h2 style={{ 
            fontFamily: 'Space Mono,monospace', fontSize: '18px', letterSpacing: '2px', 
            color: 'var(--cyan)', marginTop: '16px', fontWeight: 600
          }}>
            "Outsmarting the heat by mapping the cool in a warming world"
          </h2>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* LEFT SIDE: Icons & Features */}
          <div className="flex flex-col gap-8 w-full lg:w-1/2">
            <FeatureItem icon={<Map size={32} />} text="LIVE THERMAL MAPPING" color="var(--orange)" />
            <FeatureItem icon={<Flame size={32} />} text="PREDICTIVE HOTSPOT AI" color="var(--pink)" />
            <FeatureItem icon={<Shield size={32} />} text="SAFE ROUTE GUIDANCE" color="var(--cyan)" />
            <FeatureItem icon={<Droplet size={32} />} text="COOLING COUNTERMEASURES" color="var(--green)" />
          </div>

          {/* RIGHT SIDE: Direct to site sign */}
          <div className="flex justify-center items-center w-full lg:w-1/2">
            <button
              onClick={onEnter}
              className="group relative flex flex-col items-center justify-center w-72 h-72 rounded-full overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(157,78,221,0.05))',
                border: '1px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 50px rgba(0,212,255,0.1)',
                transition: 'all 0.4s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 0 80px rgba(0,212,255,0.4)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col items-center gap-4">
                <ArrowRight size={50} color="var(--cyan)" className="group-hover:translate-x-3 transition-transform duration-300" />
                <span style={{ 
                  fontFamily: 'Bebas Neue,sans-serif', fontSize: '36px', letterSpacing: '4px', 
                  color: 'var(--text)', textShadow: '0 0 10px rgba(255,255,255,0.2)'
                }}>
                  DIRECT TO SITE
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM RIGHT CORNER: Signature */}
      <div className="absolute bottom-6 right-8 z-20">
        <span style={{ 
          fontFamily: 'Space Mono,monospace', fontSize: '12px', color: 'var(--muted)', 
          letterSpacing: '1px' 
        }}>
          built with love by @Parv
        </span>
      </div>

    </div>
  );
}
