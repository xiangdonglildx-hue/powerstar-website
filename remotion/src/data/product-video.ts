export interface ProductFeature {
  title: string;
  mockupSrc: string;
}

export interface ProductVideoData {
  name: string;
  tagline: string;
  accentColor: string;
  iconSrc: string;
  features: ProductFeature[];
  ctaText: string;
  playStoreUrl: string;
}

export const voiceChangerVideo: ProductVideoData = {
  name: 'Voice Changer',
  tagline: 'Transform your voice in real time',
  accentColor: '#F472B6',
  iconSrc: '/voice-changer/icon-voice-changer.png',
  features: [
    {title: '100+ Voice Effects', mockupSrc: '/voice-changer/mockup-voice-changer-1.png'},
    {title: 'Real-time Preview', mockupSrc: '/voice-changer/mockup-voice-changer-1.png'},
    {title: 'Record & Share', mockupSrc: '/voice-changer/mockup-voice-changer-1.png'},
  ],
  ctaText: 'Download Free',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lixiangdong.voicechange',
};

export const aiPhotoVideo: ProductVideoData = {
  name: 'AI Photo',
  tagline: '34+ AI-powered effects in one tap',
  accentColor: '#FF4D00',
  iconSrc: '/ai-photo/ai-photo-icon.png',
  features: [
    {title: 'AI Style Filters', mockupSrc: '/ai-photo/mockup-ai-photo-1.png'},
    {title: 'Photo & Video Effects', mockupSrc: '/ai-photo/mockup-ai-photo-2.png'},
    {title: 'One-tap Edits', mockupSrc: '/ai-photo/mockup-ai-photo-1.png'},
  ],
  ctaText: 'Download Free',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.powerstar.aiphoto',
};

export const lumiwallVideo: ProductVideoData = {
  name: 'Lumiwall',
  tagline: 'Beautiful wallpapers for every mood',
  accentColor: '#8B5CF6',
  iconSrc: '/lumiwall/icon-lumiwall.png',
  features: [
    {title: 'HD Wallpapers', mockupSrc: '/lumiwall/mockup-lumiwall-1.png'},
    {title: 'Daily Updates', mockupSrc: '/lumiwall/mockup-lumiwall-1.png'},
    {title: 'Easy to Use', mockupSrc: '/lumiwall/mockup-lumiwall-1.png'},
  ],
  ctaText: 'Download Free',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.powerstar.lumiwall',
};

export const thermometerVideo: ProductVideoData = {
  name: 'Thermometer',
  tagline: 'Accurate temperature at your fingertips',
  accentColor: '#EF4444',
  iconSrc: '/thermometer/icon-thermometer.png',
  features: [
    {title: 'Instant Readings', mockupSrc: '/thermometer/mockup-thermometer-1.png'},
    {title: 'History Tracking', mockupSrc: '/thermometer/mockup-thermometer-1.png'},
    {title: 'Easy Interface', mockupSrc: '/thermometer/mockup-thermometer-1.png'},
  ],
  ctaText: 'Download Free',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.powerstar.thermometer',
};

export const microphoneVideo: ProductVideoData = {
  name: 'Microphone',
  tagline: 'Amplify and record with clarity',
  accentColor: '#10B981',
  iconSrc: '/microphone/icon-microphone.png',
  features: [
    {title: 'Voice Amplifier', mockupSrc: '/microphone/mockup-microphone-1.png'},
    {title: 'Clear Recording', mockupSrc: '/microphone/mockup-microphone-1.png'},
    {title: 'Easy Sharing', mockupSrc: '/microphone/mockup-microphone-1.png'},
  ],
  ctaText: 'Download Free',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.powerstar.microphone',
};
