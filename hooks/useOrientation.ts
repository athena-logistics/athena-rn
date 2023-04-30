// useOrientation.tsx
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export interface Orientation {
  isPortrait: boolean;
  isLandscape: boolean;
  isLargeScreen?: boolean;
}
/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'PORTRAIT' or 'LANDSCAPE'
 */
export const useOrientation = (): Orientation => {
  // State to hold the connection status
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(
    isPortrait() ? 'PORTRAIT' : 'LANDSCAPE'
  );

  const callback = () => {
    setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', callback);

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  return {
    isPortrait: orientation === 'PORTRAIT',
    isLandscape: orientation === 'LANDSCAPE',
  };
};
