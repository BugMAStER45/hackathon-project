import React, { useMemo } from 'react';
import { Flame, Map, Shield, Droplet, ArrowRight, Globe, Satellite } from 'lucide-react';

/* ── SAKURA / ANIME STYLE TREE COMPONENTS ── */
const Leaf = ({ cx, cy, baseRot, delayClass, color1="#2e7d32", color2="#81c784", scale=1 }) => (
  <g transform={`translate(${cx}, ${cy}) rotate(${baseRot}) scale(${scale})`}>
    <g className={delayClass} style={{ transformOrigin: '0px 0px' }}>
      <path d="M0,0 C15,-15 35,-5 40,15 C20,20 5,15 0,0 Z" fill={color1} />
      <path d="M0,0 C15,-15 25,-10 30,5 C15,10 5,10 0,0 Z" fill={color2} opacity="0.9" />
    </g>
  </g>
);

const Flower = ({ cx, cy, scale=1, delayClass="animate-rustle-1" }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
     <g className={delayClass} style={{ transformOrigin: '0px 0px' }}>
       <circle cx="-5" cy="-5" r="7" fill="#ffb6c1" />
       <circle cx="5" cy="-5" r="7" fill="#ff99cc" />
       <circle cx="-6" cy="5" r="7" fill="#ff69b4" />
       <circle cx="6" cy="5" r="7" fill="#ffb6c1" />
       <circle cx="0" cy="8" r="7" fill="#ff99cc" />
       <circle cx="0" cy="0" r="3" fill="#ff1493" />
       <circle cx="0" cy="0" r="1.5" fill="#fff" />
     </g>
  </g>
);

const TreeBranch = ({ flip }) => {
  const leaves = useMemo(() => {
    const arr = [];
    let seed = flip ? 100 : 1;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    const addCluster = (x, y, spreadX, spreadY, count) => {
      for(let i=0; i<count; i++) {
         const lx = x + (random() - 0.5) * spreadX;
         const ly = y + (random() - 0.5) * spreadY;
         const rot = random() * 360;
         const delay = random() > 0.5 ? "animate-rustle-1" : "animate-rustle-2";
         // True natural greens
         const c1 = random() > 0.5 ? "#1b5e20" : "#2e7d32";
         const c2 = random() > 0.5 ? "#66bb6a" : "#81c784";
         const s = 0.7 + random() * 0.7;
         arr.push(<Leaf key={seed} cx={lx} cy={ly} baseRot={rot} delayClass={delay} color1={c1} color2={c2} scale={s} />);
      }
    };

    // Generating ~80 dense leaves organically across the original curved branches
    addCluster(60, 25, 70, 50, 15);
    addCluster(150, 60, 90, 60, 20);
    addCluster(240, 90, 80, 50, 15);
    addCluster(120, 100, 60, 50, 12);
    addCluster(180, 140, 70, 60, 15);
    addCluster(250, 140, 60, 50, 10);

    return arr;
  }, [flip]);

  return (
    // Re-adjusted width so it's visible but doesn't overlap text
    <div className={`absolute top-0 ${flip ? 'right-0 animate-branch-swing-right' : 'left-0 animate-branch-swing'} w-64 lg:w-[400px] h-auto z-20 pointer-events-none`}>
      <svg 
        viewBox="0 0 350 250" 
        className="w-full h-auto overflow-visible"
        style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))' }}
      >
        {/* Tilted by 15 degrees from the horizontal to pull it up away from the UI */}
        <g transform={flip ? "translate(350, 0) scale(-1, 1) rotate(-15, 0, 0)" : "rotate(-15, 0, 0)"}>
          
          {/* Thick Original Curves */}
          <path d="M0,0 Q120,60 280,100" fill="none" stroke="#3e2723" strokeWidth="24" strokeLinecap="round" />
          <path d="M60,30 Q160,120 220,180" fill="none" stroke="#3e2723" strokeWidth="16" strokeLinecap="round" />
          <path d="M140,65 Q230,130 280,150" fill="none" stroke="#3e2723" strokeWidth="12" strokeLinecap="round" />
          <path d="M200,85 Q260,110 320,120" fill="none" stroke="#3e2723" strokeWidth="8" strokeLinecap="round" />
          
          {/* Dynamically Generated Massive Leaf Canopy */}
          {leaves}

          {/* Just 4 Single Sakura Flowers Scattered (Less Flowers) */}
          <Flower cx={140} cy={50} scale={1.5} delayClass="animate-rustle-1" />
          <Flower cx={220} cy={95} scale={1.2} delayClass="animate-rustle-2" />
          <Flower cx={170} cy={140} scale={1.3} delayClass="animate-rustle-1" />
          <Flower cx={260} cy={135} scale={1.4} delayClass="animate-rustle-2" />
          
        </g>
      </svg>
    </div>
  );
};

const FallingLeafAnim = ({ left, right, delay, duration="4s", type="leaf" }) => {
  const style = { animationDelay: delay, animationDuration: duration };
  const baseClass = left !== undefined ? "falling-leaf animate-[leafFall]" : "falling-leaf animate-[leafFallRight]";
  return (
    <svg 
      className={baseClass} 
      style={{ ...style, left: left, right: right, top: '40px', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.3))' }}
      viewBox="-10 -10 60 60"
    >
      {type === 'petal' ? (
        <path d="M10,20 C-5,10 5,0 10,0 C15,0 25,10 10,20 Z" fill="#ffb6c1" opacity="0.9" />
      ) : (
        <g>
          <path d="M0,0 C15,-15 35,-5 40,15 C20,20 5,15 0,0 Z" fill="#2e7d32" opacity="0.9" />
          <path d="M0,0 C15,-15 25,-10 30,5 C15,10 5,10 0,0 Z" fill="#81c784" opacity="0.9" />
        </g>
      )}
    </svg>
  )
}

const FallenLeaf = ({ left, right, bottom, rot, color1="#2e7d32", color2="#81c784", scale=1 }) => (
  <svg className="absolute" style={{ left, right, bottom, transform: `rotate(${rot}deg) scale(${scale})`, width: '40px', height: '40px', overflow: 'visible' }}>
     <path d="M0,0 C15,-15 35,-5 40,15 C20,20 5,15 0,0 Z" fill={color1} />
     <path d="M0,0 C15,-15 25,-10 30,5 C15,10 5,10 0,0 Z" fill={color2} opacity="0.9" />
  </svg>
)

const FallenPinkPetal = ({ left, right, bottom, rot, scale=1, fill="#ffb6c1" }) => (
  <svg className="absolute" style={{ left, right, bottom, transform: `rotate(${rot}deg) scale(${scale})`, width: '20px', height: '20px', overflow: 'visible' }}>
     <path d="M10,20 C-5,10 5,0 10,0 C15,0 25,10 10,20 Z" fill={fill} />
  </svg>
)

const FallenDebris = () => (
  <div className="absolute bottom-0 left-0 w-full h-16 z-20 pointer-events-none opacity-80">
     <FallenLeaf left="10%" bottom="0px" rot={45} scale={0.7} />
     <FallenLeaf left="18%" bottom="-5px" rot={15} scale={0.5} />
     <FallenPinkPetal left="25%" bottom="4px" rot={-30} scale={0.7} />
     <FallenLeaf left="35%" bottom="2px" rot={70} scale={0.6} />
     
     <FallenLeaf right="12%" bottom="-2px" rot={-45} scale={0.7} />
     <FallenPinkPetal right="20%" bottom="8px" rot={-85} scale={0.6} fill="#ff99cc" />
     <FallenLeaf right="28%" bottom="0px" rot={60} scale={0.6} />
     <FallenLeaf right="40%" bottom="5px" rot={20} scale={0.7} />
     
     <FallenPinkPetal left="48%" bottom="-2px" rot={10} scale={0.8} />
     <FallenLeaf left="55%" bottom="-10px" rot={15} scale={0.8} />
  </div>
)
/* ─────────────────────────────────────── */

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

      {/* Falling Leaves & Petals */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-30">
         <FallingLeafAnim left="8%" delay="0.8s" duration="4.5s" type="leaf" />
         <FallingLeafAnim left="16%" delay="1.4s" duration="5.2s" type="petal" />
         <FallingLeafAnim left="4%" delay="2.1s" duration="4.8s" type="leaf" />

         <FallingLeafAnim right="12%" delay="0.5s" duration="4.2s" type="leaf" />
         <FallingLeafAnim right="20%" delay="1.8s" duration="5.5s" type="leaf" />
         <FallingLeafAnim right="6%" delay="2.6s" duration="4.6s" type="petal" />
      </div>

      {/* Anime Tree Branches (Top Left & Top Right) */}
      <TreeBranch />
      <TreeBranch flip={true} />

      {/* Static Fallen Debris on the Ground */}
      <FallenDebris />

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
