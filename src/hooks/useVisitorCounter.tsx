
import { useState, useEffect } from 'react';

export const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Get current count from localStorage
    const currentCount = localStorage.getItem('visitorCount');
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    
    // Increment count on each page load/refresh
    const newCount = count + 1;
    setVisitorCount(newCount);
    
    // Store updated count
    localStorage.setItem('visitorCount', newCount.toString());
  }, []);

  return visitorCount;
};
