export type ProductOgData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  stats: Array<{label: string; value: string}>;
  theme: {
    primary: string;
    secondary: string;
    glow: string;
    surface: string;
    border: string;
    textMuted: string;
  };
  iconSrc: string;
  mockupSrc: string;
  accentMockupSrc?: string;
  calloutEyebrow: string;
  calloutText: string;
};
