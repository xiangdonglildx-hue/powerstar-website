import {Composition} from 'remotion';
import {AIPhotoOg} from './compositions/AIPhotoOg';
import {VoiceChangerOg} from './compositions/VoiceChangerOg';

export const Root = () => {
  return (
    <>
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
    </>
  );
};
