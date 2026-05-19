import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';

export const IntroScene: React.FC<{
  name: string;
  tagline: string;
  accentColor: string;
  iconSrc: string;
}> = ({name, tagline, accentColor, iconSrc}) => {
  const frame = useCurrentFrame();

  const iconScale = interpolate(frame, [0, 20], [0.6, 1], {
    extrapolateRight: 'clamp',
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const taglineOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const glowOpacity = interpolate(frame, [0, 30], [0, 0.3], {
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
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: 'blur(60px)',
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <Img
          src={staticFile(iconSrc)}
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            transform: `scale(${iconScale})`,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            opacity: titleOpacity,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            opacity: taglineOpacity,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
