
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const incrementAndGetCount = async () => {
      try {
        // Call the increment function to atomically increment and get the new count
        const { data, error } = await supabase.rpc('increment_visitor_count');
        
        if (error) {
          console.error('Error incrementing visitor count:', error);
          // Fallback to reading current count if increment fails
          const { data: currentData, error: readError } = await supabase
            .from('visitor_counter')
            .select('count')
            .eq('id', 1)
            .single();
          
          if (readError) {
            console.error('Error reading visitor count:', readError);
          } else {
            setVisitorCount(currentData?.count || 0);
          }
        } else {
          setVisitorCount(data || 0);
        }
      } catch (err) {
        console.error('Unexpected error with visitor counter:', err);
      }
    };

    incrementAndGetCount();
  }, []);

  return visitorCount;
};
