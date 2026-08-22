import React from 'react';

function Box({ w='100%', h='16px', br='8px', mb='0' }) {
  return <div className="skeleton" style={{ width:w, height:h, borderRadius:br, marginBottom:mb }} />;
}

export function MetricBannerSkeleton() {
  return (
    <div style={{ display:'flex', gap:'12px', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flex:1, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'12px' }}>
          <Box h='10px' w='60%' mb='8px' />
          <Box h='24px' w='80%' />
        </div>
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div style={{ height:'600px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'16px' }}>
      <div className="skeleton" style={{ width:'100%', height:'100%', borderRadius:'16px' }} />
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'14px' }}>
          <Box h='14px' w='60%' mb='8px' />
          <Box h='10px' w='80%' mb='6px' />
          <Box h='10px' w='40%' />
        </div>
      ))}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px', padding:'20px' }}>
      <MapSkeleton />
      <CardSkeleton count={4} />
    </div>
  );
}
