import {Composition} from 'remotion';
import {AIPhotoOg} from './compositions/AIPhotoOg';

export const Root = () => {
  return (
    <Composition
      id="AIPhotoOg"
      component={AIPhotoOg}
      width={1200}
      height={630}
      fps={30}
      durationInFrames={90}
      defaultProps={{}}
    />
  );
};
