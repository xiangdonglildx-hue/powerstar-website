import {Composition} from 'remotion';
import {AIPhotoOg} from './compositions/AIPhotoOg';
import {VoiceChangerOg} from './compositions/VoiceChangerOg';
import {ProductVideo} from './compositions/ProductVideo';
import {LumiwallVideo} from './compositions/LumiwallVideo';
import {
  voiceChangerVideo,
  aiPhotoVideo,
  lumiwallVideo,
  thermometerVideo,
  microphoneVideo,
} from './data/product-video';

export const Root = () => {
  return (
    <>
      {/* OG Images */}
      <Composition
        id="AIPhotoOg"
        component={AIPhotoOg}
        width={1200}
        height={630}
        fps={30}
        durationInFrames={90}
        defaultProps={{}}
      />
      <Composition
        id="VoiceChangerOg"
        component={VoiceChangerOg}
        width={1200}
        height={630}
        fps={30}
        durationInFrames={90}
        defaultProps={{}}
      />

      {/* Product Videos */}
      <Composition
        id="VoiceChangerVideo"
        component={ProductVideo}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={540}
        defaultProps={{data: voiceChangerVideo}}
      />
      <Composition
        id="AIPhotoVideo"
        component={ProductVideo}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={540}
        defaultProps={{data: aiPhotoVideo}}
      />
      <Composition
        id="LumiwallVideo"
        component={LumiwallVideo}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={480}
        defaultProps={{}}
      />
      <Composition
        id="ThermometerVideo"
        component={ProductVideo}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={540}
        defaultProps={{data: thermometerVideo}}
      />
      <Composition
        id="MicrophoneVideo"
        component={ProductVideo}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={540}
        defaultProps={{data: microphoneVideo}}
      />
    </>
  );
};
