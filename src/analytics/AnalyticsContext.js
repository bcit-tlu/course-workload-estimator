import React, { createContext, useContext, useMemo } from 'react';
import { useAnalytics } from './useAnalytics';

const AnalyticsContext = createContext({ trackEvent: () => {} });

export function AnalyticsProvider({ children }) {
  const analytics = useAnalytics();
  const value = useMemo(() => analytics, [analytics]);
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useTrackEvent() {
  return useContext(AnalyticsContext).trackEvent;
}
