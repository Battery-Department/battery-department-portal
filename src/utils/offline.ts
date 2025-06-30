export const offline = {
  isOffline: () => typeof window !== 'undefined' ? !navigator.onLine : false,
  onStatusChange: (callback: (online: boolean) => void) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => callback(true));
      window.addEventListener('offline', () => callback(false));
    }
  }
};

export function useOnlineStatus() {
  if (typeof window !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}
