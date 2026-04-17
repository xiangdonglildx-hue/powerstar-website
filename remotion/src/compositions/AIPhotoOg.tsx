import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {aiPhotoData} from '../data/ai-photo';

const StatCard: React.FC<{label: string; value: string}> = ({label, value}) => {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '24px 22px',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: 'white',
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const AIPhotoOg: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily: 'Inter, Work Sans, system-ui, sans-serif',
        background:
          'radial-gradient(circle at top left, rgba(255, 120, 64, 0.28), transparent 38%), linear-gradient(135deg, #050505 0%, #121212 55%, #1d120c 100%)',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -60,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,77,0,0.34) 0%, rgba(255,77,0,0) 70%)',
          filter: 'blur(18px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 56,
          bottom: 56,
          display: 'flex',
          gap: 44,
        }}
      >
        <div
          style={{
            width: 640,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 18px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Img
                src={staticFile(aiPhotoData.iconSrc)}
                style={{width: 36, height: 36, borderRadius: 10}}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                {aiPhotoData.eyebrow}
              </span>
            </div>

            <div
              style={{
                marginTop: 26,
                fontSize: 78,
                lineHeight: 0.92,
                fontWeight: 900,
                letterSpacing: '-0.055em',
              }}
            >
              {aiPhotoData.title}
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 30,
                lineHeight: 1.2,
                fontWeight: 650,
                color: 'rgba(255,255,255,0.84)',
                maxWidth: 600,
              }}
            >
              {aiPhotoData.subtitle}
            </div>

            <div
              style={{
                marginTop: 18,
                fontSize: 22,
                lineHeight: 1.45,
                color: aiPhotoData.theme.textMuted,
                maxWidth: 570,
              }}
            >
              {aiPhotoData.description}
            </div>
          </div>

          <div style={{display: 'flex', gap: 16}}>
            {aiPhotoData.stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 390,
              height: 390,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,77,0,0.24) 0%, rgba(255,77,0,0) 72%)',
              filter: 'blur(10px)',
            }}
          />

          <Img
            src={staticFile(aiPhotoData.accentMockupSrc)}
            style={{
              position: 'absolute',
              width: 270,
              right: 24,
              top: 96,
              opacity: 0.22,
              transform: 'rotate(10deg)',
              borderRadius: 36,
              boxShadow: '0 24px 54px rgba(0,0,0,0.28)',
            }}
          />

          <div
            style={{
              width: 318,
              padding: 22,
              borderRadius: 44,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.32)',
              transform: 'rotate(-6deg)',
            }}
          >
            <Img
              src={staticFile(aiPhotoData.mockupSrc)}
              style={{
                width: '100%',
                borderRadius: 28,
                border: '8px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 24,
              padding: '16px 20px',
              borderRadius: 24,
              background: 'rgba(13,13,13,0.78)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.24)',
            }}
          >
            <div style={{fontSize: 18, color: 'rgba(255,255,255,0.66)', marginBottom: 6}}>
              Android creative toolkit
            </div>
            <div style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em'}}>
              Holiday looks, pro styles, one-tap edits
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
