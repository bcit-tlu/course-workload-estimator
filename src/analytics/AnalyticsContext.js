import React, { createContext, useContext } from 'react';
import { useAnalytics } from './useAnalytics';

const AnalyticsContext = createContext({
  trackEvent: () => {},
  trackPageView: () => {},
});

export function AnalyticsProvider({ children }) {
  const analytics = useAnalytics();
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}

export function useTrackEvent() {
  return useContext(AnalyticsContext).trackEvent;
}
