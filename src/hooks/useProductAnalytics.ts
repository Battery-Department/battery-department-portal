export function useProductAnalytics() {
  return {
    trackEvent: (event: string, data?: any) => {
      console.log('Analytics event:', event, data);
    }
  };
}
