import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Sequence} from 'remotion';

const WALLPAPERS = [
  '/lumiwall/mockup-lumiwall-1.png',
  '/lumiwall/mockup-lumiwall-2.png',
  '/lumiwall/mockup-lumiwall-3.png',
  '/lumiwall/mockup-lumiwall-4.png',
];

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(frame, [0, 30], [1.1, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(WALLPAPERS[0])}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity}}>
          <Img
            src={staticFile('/lumiwall/icon-lumiwall.png')}
            style={{width: 100, height: 100, borderRadius: 24}}
          />
          <div style={{fontSize: 64, fontWeight: 900, color: 'white', letterSpacing: '-0.04em'}}>
            Lumiwall
          </div>
          <div style={{fontSize: 24, color: 'rgba(255,255,255,0.8)', fontWeight: 500}}>
            Beautiful Wallpapers for Your Phone
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CarouselScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {WALLPAPERS.map((src, i) => {
        const startFrame = i * 45;
        const itemFrame = frame - startFrame;

        if (itemFrame < 0 || itemFrame > 60) return null;

        const slideIn = interpolate(itemFrame, [0, 15], [100, 0], {extrapolateRight: 'clamp'});
        const slideOut = interpolate(itemFrame, [45, 60], [0, -100], {extrapolateRight: 'clamp'});
        const x = itemFrame < 45 ? slideIn : slideOut;
        const opacity = interpolate(itemFrame, [0, 10, 50, 60], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

        return (
          <Img
            key={i}
            src={staticFile(src)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translateX(${x}%)`,
              opacity,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'white',
          fontSize: 28,
          fontWeight: 700,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        Thousands of HD & 4K Wallpapers
      </div>
    </AbsoluteFill>
  );
};

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const features = [
    {title: 'HD & 4K Quality', desc: 'Crystal clear wallpapers'},
    {title: 'Daily Updates', desc: 'Fresh content every day'},
    {title: 'Easy to Apply', desc: 'One tap to set wallpaper'},
  ];

  return (
    <AbsoluteFill style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '0 80px',
          gap: 40,
        }}
      >
        {features.map((f, i) => {
          const delay = i * 20;
          const opacity = interpolate(frame - delay, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
          const x = interpolate(frame - delay, [0, 15], [-40, 0], {extrapolateRight: 'clamp'});

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{fontSize: 32, fontWeight: 700, color: 'white'}}>{f.title}</div>
                <div style={{fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 4}}>{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(frame, [10, 30], [0.8, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img
        src={staticFile(WALLPAPERS[2])}
        style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3}}
      />
      <AbsoluteFill
        style={{
          background: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity}}>
          <div style={{fontSize: 48, fontWeight: 700, color: 'white'}}>
            Download Lumiwall
          </div>
          <div
            style={{
              padding: '16px 48px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              fontSize: 24,
              fontWeight: 700,
              color: 'white',
              transform: `scale(${scale})`,
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
            }}
          >
            Get it on Google Play
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LumiwallVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={60} name="Intro">
        <IntroScene />
      </Sequence>
      <Sequence from={60} durationInFrames={180} name="Carousel">
        <CarouselScene />
      </Sequence>
      <Sequence from={240} durationInFrames={120} name="Features">
        <FeaturesScene />
      </Sequence>
      <Sequence from={360} durationInFrames={120} name="CTA">
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
