import React from 'react';
import { Flame, Map, Shield, Droplet, ArrowRight, Globe, Satellite } from 'lucide-react';

/* ── ANIME STYLE TREE BRANCH COMPONENTS ── */
const Leaf = ({ cx, cy, baseRot, delayClass, color1="#00e676", color2="#69f0ae", scale=1 }) => (
  <g transform={`translate(${cx}, ${cy}) rotate(${baseRot}) scale(${scale})`}>
    <g className={delayClass} style={{ transformOrigin: '0px 0px' }}>
      <path d="M0,0 C15,-15 35,-5 40,15 C20,20 5,15 0,0 Z" fill={color1} />
      <path d="M0,0 C15,-15 25,-10 30,5 C15,10 5,10 0,0 Z" fill={color2} opacity="0.9" />
    </g>
  </g>
);

const TreeBranch = ({ flip }) => (
  <svg 
    viewBox="0 0 350 250" 
    className={`absolute top-0 ${flip ? 'right-0 scale-x-[-1]' : 'left-0'} w-72 lg:w-96 h-auto z-20 pointer-events-none`} 
    style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))' }}
  >
    <path d="M0,0 Q120,40 280,70" fill="none" stroke="#2d1b14" strokeWidth="16" strokeLinecap="round" />
    <path d="M40,10 Q140,90 220,160" fill="none" stroke="#2d1b14" strokeWidth="10" strokeLinecap="round" />
    <path d="M150,50 Q220,90 270,120" fill="none" stroke="#2d1b14" strokeWidth="8" strokeLinecap="round" />
    
    <Leaf cx={50} cy={15} baseRot={-40} delayClass="animate-rustle-1" />
    <Leaf cx={90} cy={30} baseRot={45} delayClass="animate-rustle-2" color1="#00c853" color2="#b9f6ca" scale={1.2} />
    <Leaf cx={140} cy={45} baseRot={-20} delayClass="animate-rustle-1" />
    <Leaf cx={190} cy={55} baseRot={60} delayClass="animate-rustle-2" scale={0.9}/>
    <Leaf cx={240} cy={65} baseRot={-30} delayClass="animate-rustle-1" color1="#00c853" />
    <Leaf cx={275} cy={70} baseRot={20} delayClass="animate-rustle-2" scale={0.8}/>

    <Leaf cx={80} cy={45} baseRot={20} delayClass="animate-rustle-2" scale={0.9}/>
    <Leaf cx={130} cy={80} baseRot={75} delayClass="animate-rustle-1" color1="#00c853"/>
    <Leaf cx={170} cy={120} baseRot={35} delayClass="animate-rustle-2" />
    <Leaf cx={215} cy={155} baseRot={80} delayClass="animate-rustle-1" scale={0.8}/>

    <Leaf cx={180} cy={65} baseRot={-10} delayClass="animate-rustle-1" scale={1.1}/>
    <Leaf cx={230} cy={95} baseRot={40} delayClass="animate-rustle-2" color1="#00c853"/>
    <Leaf cx={265} cy={115} baseRot={-15} delayClass="animate-rustle-1" scale={0.9}/>
  </svg>
);

function AnimatedThermalCore() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      <div className="absolute inset-0 border-[3px] border-dashed border-cyan-500/30 rounded-full animate-[spin_12s_linear_infinite]" />
      <div className="absolute inset-4 border-[3px] border-dotted border-orange-500/30 rounded-full animate-[spin_8s_reverse_linear_infinite]" />
      <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 rounded-full p-1 border border-cyan-500/50">
           <Satellite size={16} className="text-cyan-400" />
         </div>
      </div>
      <div className="relative z-10 text-cyan-400 heat-pulse" style={{ filter: 'drop-shadow(0 0 15px rgba(0,212,255,0.6))' }}>
         <Globe size={64} />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-20">
         <div className="w-full h-1 bg-green-400/60 blur-[1px] animate-radar-scan" style={{ boxShadow: '0 0 15px rgba(0,255,136,0.8)' }} />
      </div>
    </div>
  );
}

function FeatureItem({ icon, text, color }) {
  return (
    <div className="flex items-center gap-4 group">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/60 border transition-all duration-300"
        style={{ borderColor: 'rgba(255,255,255,0.05)', color: color, boxShadow: `0 0 10px ${color}15` }}
      >
        {icon}
      </div>
      <span style={{ 
        fontFamily: 'Bebas Neue,sans-serif', fontSize: '18px', letterSpacing: '2px', 
        color: 'var(--text)'
      }}>
        {text}
      </span>
    </div>
  );
}

export default function LandingPage({ onEnter }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#000000' }}>
      
      {/* Anime Wind Lines */}
      <div className="absolute top-16 left-0 w-64 wind-line" style={{ animationDelay: '0.1s' }} />
      <div className="absolute top-32 left-0 w-96 wind-line" style={{ animationDelay: '0.4s', height: '3px' }} />
      <div className="absolute top-10 left-0 w-48 wind-line" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-52 left-0 w-72 wind-line" style={{ animationDelay: '0.6s' }} />

      {/* Anime Tree Branches (Top Left & Top Right) */}
      <TreeBranch />
      <TreeBranch flip={true} />

      {/* Cinematic glowing background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center w-full max-w-6xl px-8 animate-fade-slide" style={{ animationDuration: '0.8s' }}>
        
        {/* LOGO */}
        <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-2xl relative z-30" style={{ 
          background: 'linear-gradient(135deg, #FF6B35, #FF2D55)', 
          boxShadow: '0 0 40px rgba(255,45,85,0.4), inset 0 0 20px rgba(255,255,255,0.2)' 
        }}>
          <Flame size={48} color="#fff" />
        </div>

        {/* TITLE & SLOGAN */}
        <h1 className="aurora-text relative z-30" style={{ 
          fontFamily: 'Bebas Neue,sans-serif', fontSize: '84px', letterSpacing: '8px', 
          lineHeight: 1, margin: 0
        }}>
          AEGIS-OASIS
        </h1>
        <h2 className="relative z-30" style={{ 
          fontFamily: 'Space Mono,monospace', fontSize: '14px', letterSpacing: '4px', 
          color: 'var(--cyan)', marginTop: '16px', fontWeight: 600
        }}>
          "OUTSMARTING THE HEAT BY MAPPING THE COOL IN A WARMING WORLD"
        </h2>

        {/* LOWER SPLIT SECTION (3-Column Layout) */}
        <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-24 gap-8 relative z-30">
          
          {/* LEFT SIDE: Features in a Green Glowing Box */}
          <div className="flex justify-center lg:w-1/3">
            <div 
              className="flex flex-col gap-4 p-8 rounded-3xl w-full max-w-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.05), rgba(0,212,255,0.02))',
                border: '1px solid rgba(0,255,136,0.3)',
                boxShadow: '0 0 30px rgba(0,255,136,0.1)'
              }}
            >
              <FeatureItem icon={<Map size={20} />} text="LIVE THERMAL MAPPING" color="var(--orange)" />
              <FeatureItem icon={<Flame size={20} />} text="PREDICTIVE HOTSPOT AI" color="var(--pink)" />
              <FeatureItem icon={<Shield size={20} />} text="SAFE ROUTE GUIDANCE" color="var(--cyan)" />
              <FeatureItem icon={<Droplet size={20} />} text="COOLING COUNTERMEASURES" color="var(--green)" />
            </div>
          </div>

          {/* CENTER: Animated Character / Theme Object */}
          <div className="flex justify-center lg:w-1/3 my-8 lg:my-0">
             <AnimatedThermalCore />
          </div>

          {/* RIGHT SIDE: Beautiful Sign Button */}
          <div className="flex justify-center lg:w-1/3">
            <button
              onClick={onEnter}
              className="group relative px-10 py-6 rounded-3xl overflow-hidden cursor-pointer w-full max-w-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(157,78,221,0.1))',
                border: '1px solid rgba(0,212,255,0.5)',
                boxShadow: '0 0 40px rgba(0,212,255,0.2)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 60px rgba(0,212,255,0.4)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.2)'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex flex-col items-center gap-2">
                <span style={{ 
                  fontFamily: 'Bebas Neue,sans-serif', fontSize: '32px', letterSpacing: '4px', 
                  color: 'var(--cyan)' 
                }}>
                  DIRECT TO SITE
                </span>
                <span className="flex items-center gap-2" style={{ 
                  fontFamily: 'Space Mono,monospace', fontSize: '12px', color: 'var(--text)', 
                  letterSpacing: '2px' 
                }}>
                  ENTER PLATFORM <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </span>
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
