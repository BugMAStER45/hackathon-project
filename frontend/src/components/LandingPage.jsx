import React from 'react';
import { Flame, Activity, Shield } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#000000' }}>
      {/* Cinematic glowing background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center animate-fade-slide" style={{ animationDuration: '0.8s' }}>
        
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center w-28 h-28 rounded-3xl" style={{ 
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)', 
          boxShadow: '0 0 50px rgba(255,45,85,0.4), inset 0 0 20px rgba(255,255,255,0.2)' 
        }}>
          <Flame size={60} color="#fff" />
        </div>

        {/* Title with Rainbow Aurora Effect */}
        <h1 className="aurora-text" style={{ 
          fontFamily: 'Bebas Neue,sans-serif', fontSize: '96px', letterSpacing: '10px', 
          lineHeight: 1
        }}>
          HEATSHIELD
        </h1>
        
        <h2 style={{ 
          fontFamily: 'Space Mono,monospace', fontSize: '15px', letterSpacing: '6px', 
          color: 'var(--cyan)', marginTop: '12px' 
        }}>
          POWERED BY FORTYGUARD THERMAL ENGINE
        </h2>

        {/* Description */}
        <p style={{ 
          fontFamily: 'Rajdhani,sans-serif', fontSize: '22px', color: 'var(--muted)', 
          maxWidth: '650px', marginTop: '32px', lineHeight: 1.6, fontWeight: 500 
        }}>
          Advanced urban climate intelligence. Detect extreme heat zones, deploy critical cooling infrastructure, and route citizens safely in real-time.
        </p>

        {/* Features Row */}
        <div className="flex gap-8 mt-12 mb-16 opacity-70">
          <div className="flex flex-col items-center gap-2">
            <Activity size={24} color="var(--orange)" />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '10px', letterSpacing: '1px' }}>LIVE TELEMETRY</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Flame size={24} color="var(--pink)" />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '10px', letterSpacing: '1px' }}>HOTSPOT AI</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield size={24} color="var(--cyan)" />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '10px', letterSpacing: '1px' }}>CITIZEN SAFETY</span>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="group relative px-12 py-5 rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(255,45,85,0.15), rgba(255,107,53,0.15))',
            border: '1px solid rgba(255,45,85,0.5)',
            boxShadow: '0 0 30px rgba(255,45,85,0.15)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 50px rgba(255,45,85,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(255,45,85,0.15)'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-4" style={{ 
            fontFamily: 'Bebas Neue,sans-serif', fontSize: '28px', letterSpacing: '3px', color: 'var(--pink)' 
          }}>
            <Activity size={28} /> INITIALIZE PLATFORM
          </span>
        </button>

      </div>
    </div>
  );
}
