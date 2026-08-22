import React from 'react';
import { Flame, Map, Shield, Droplet, ArrowRight } from 'lucide-react';

function FeatureItem({ icon, text, color }) {
  return (
    <div className="flex items-center gap-5 group">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900/50 border transition-all duration-300"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: color, boxShadow: `0 0 15px ${color}15` }}
      >
        {icon}
      </div>
      <span style={{ 
        fontFamily: 'Bebas Neue,sans-serif', fontSize: '24px', letterSpacing: '2px', 
        color: 'var(--text)', textShadow: '0 0 10px rgba(255,255,255,0.1)' 
      }}>
        {text}
      </span>
    </div>
  );
}

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#000000' }}>
      {/* Cinematic glowing background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center w-full max-w-5xl px-8 animate-fade-slide" style={{ animationDuration: '0.8s' }}>
        
        {/* LOGO (Restored from earlier design) */}
        <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-2xl" style={{ 
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)', 
          boxShadow: '0 0 40px rgba(255,45,85,0.4), inset 0 0 20px rgba(255,255,255,0.2)' 
        }}>
          <Flame size={48} color="#fff" />
        </div>

        {/* TITLE & SLOGAN (Scaled down to earlier size) */}
        <h1 className="aurora-text" style={{ 
          fontFamily: 'Bebas Neue,sans-serif', fontSize: '84px', letterSpacing: '8px', 
          lineHeight: 1, margin: 0
        }}>
          AEGIS-OASIS
        </h1>
        <h2 style={{ 
          fontFamily: 'Space Mono,monospace', fontSize: '14px', letterSpacing: '4px', 
          color: 'var(--cyan)', marginTop: '16px' 
        }}>
          "OUTSMARTING THE HEAT BY MAPPING THE COOL IN A WARMING WORLD"
        </h2>

        {/* LOWER SPLIT SECTION (Left: Icons, Right: Button) */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-24 gap-12">
          
          {/* LEFT SIDE: Features */}
          <div className="flex flex-col gap-6 text-left lg:w-1/2 lg:pl-12">
            <FeatureItem icon={<Map size={24} />} text="LIVE THERMAL MAPPING" color="var(--orange)" />
            <FeatureItem icon={<Flame size={24} />} text="PREDICTIVE HOTSPOT AI" color="var(--pink)" />
            <FeatureItem icon={<Shield size={24} />} text="SAFE ROUTE GUIDANCE" color="var(--cyan)" />
            <FeatureItem icon={<Droplet size={24} />} text="COOLING COUNTERMEASURES" color="var(--green)" />
          </div>

          {/* RIGHT SIDE: Beautiful Sign Button */}
          <div className="flex justify-center lg:w-1/2">
            <button
              onClick={onEnter}
              className="group relative px-10 py-6 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(157,78,221,0.05))',
                border: '1px solid rgba(0,212,255,0.4)',
                boxShadow: '0 0 40px rgba(0,212,255,0.15)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 60px rgba(0,212,255,0.3)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.15)'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-2">
                <span style={{ 
                  fontFamily: 'Bebas Neue,sans-serif', fontSize: '32px', letterSpacing: '4px', 
                  color: 'var(--cyan)' 
                }}>
                  DIRECT TO SITE
                </span>
                <span className="flex items-center gap-2" style={{ 
                  fontFamily: 'Space Mono,monospace', fontSize: '11px', color: 'var(--text)', 
                  letterSpacing: '2px' 
                }}>
                  ENTER PLATFORM <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM RIGHT CORNER: Signature */}
      <div className="absolute bottom-6 right-8 z-20">
        <span style={{ 
          fontFamily: 'Space Mono,monospace', fontSize: '11px', color: 'var(--muted)', 
          letterSpacing: '1px' 
        }}>
          built with love by @Parv
        </span>
      </div>

    </div>
  );
}
