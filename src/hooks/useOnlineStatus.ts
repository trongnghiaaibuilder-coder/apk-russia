import { useState, useEffect } from 'react';
import { connectivityService } from '../services/connectivity';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(connectivityService.getStatus());

  useEffect(() => {
    const unsubscribe = connectivityService.subscribe((status) => {
      setIsOnline(status);
    });
    return unsubscribe;
  }, []);

  return isOnline;
}
