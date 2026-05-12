import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ProductVideoData} from '../data/product-video';
import {IntroScene} from './scenes/IntroScene';
import {FeatureScene} from './scenes/FeatureScene';
import {CTAScene} from './scenes/CTAScene';

const INTRO_DURATION = 60;   // 2 seconds
const FEATURE_DURATION = 120; // 4 seconds per feature
const CTA_DURATION = 120;      // 4 seconds

export const ProductVideo: React.FC<{data: ProductVideoData}> = ({data}) => {
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <Sequence from={0} durationInFrames={INTRO_DURATION} name="Intro">
        <IntroScene
          name={data.name}
          tagline={data.tagline}
          accentColor={data.accentColor}
          iconSrc={data.iconSrc}
        />
      </Sequence>

      {data.features.map((feature, i) => (
        <Sequence
          key={feature.title}
          from={INTRO_DURATION + i * FEATURE_DURATION}
          durationInFrames={FEATURE_DURATION}
          name={`Feature: ${feature.title}`}
        >
          <FeatureScene
            title={feature.title}
            mockupSrc={feature.mockupSrc}
            accentColor={data.accentColor}
          />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_DURATION + data.features.length * FEATURE_DURATION}
        durationInFrames={CTA_DURATION}
        name="CTA"
      >
        <CTAScene ctaText={data.ctaText} accentColor={data.accentColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
