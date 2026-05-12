import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const CTAScene: React.FC<{
  ctaText: string;
  accentColor: string;
}> = ({ctaText, accentColor}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: 'clamp',
  });
  const btnOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const btnScale = interpolate(frame, [10, 25], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: 0.2,
          filter: 'blur(60px)',
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32}}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          Power Star Apps
        </div>
        <div
          style={{
            padding: '18px 48px',
            borderRadius: 16,
            background: accentColor,
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
            opacity: btnOpacity,
            transform: `scale(${btnScale})`,
            boxShadow: `0 12px 40px ${accentColor}66`,
          }}
        >
          {ctaText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
