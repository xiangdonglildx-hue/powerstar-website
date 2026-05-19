import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';

export const FeatureScene: React.FC<{
  title: string;
  mockupSrc: string;
  accentColor: string;
}> = ({title, mockupSrc, accentColor}) => {
  const frame = useCurrentFrame();

  const textX = interpolate(frame, [0, 20], [-60, 0], {
    extrapolateRight: 'clamp',
  });
  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const mockupScale = interpolate(frame, [5, 25], [0.9, 1], {
    extrapolateRight: 'clamp',
  });
  const mockupOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
        padding: '0 80px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -100,
          top: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: 0.15,
          filter: 'blur(80px)',
        }}
      />
      <div style={{display: 'flex', alignItems: 'center', gap: 80, width: '100%'}}>
        <div
          style={{
            flex: 1,
            transform: `translateX(${textX}px)`,
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${mockupScale})`,
            opacity: mockupOpacity,
          }}
        >
          <Img
            src={staticFile(mockupSrc)}
            style={{
              width: 280,
              borderRadius: 32,
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              border: '3px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
