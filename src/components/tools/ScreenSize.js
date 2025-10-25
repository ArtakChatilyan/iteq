import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        screenWidth: window.outerWidth,
        screenHeight: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  return screenSize;
};

export default useScreenSize;