// useAppRefresh.js
import { useEffect, useState } from 'react';

const useAppRefresh = (renderData:()=>void) => {

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const minutes = currentTime.getMinutes();

      // Check if current time is at 7:30, 8:00, 8:30, 9:00, etc.
      if (minutes === 30 || minutes === 0 ||  minutes === 4) {
        console.log(`Refreshing the app at ${currentTime.toLocaleTimeString()}`);
        renderData()
      }
      
    }, 1000 * 60); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

};

export default useAppRefresh;
