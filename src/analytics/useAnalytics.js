import { useEffect, useMemo, useRef, useCallback } from 'react';
import { logEvent } from './init';

function getSessionId() {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
}

const commonAttributes = {
  'user_agent': navigator.userAgent,
  'screen_resolution': `${screen.width}x${screen.height}`,
  'referrer': document.referrer || '',
};

export function useAnalytics() {
  const sessionId = useRef(getSessionId());
  const startTime = useRef(Date.now());

  const trackEvent = useCallback((eventName, attributes = {}) => {
    logEvent(eventName, {
      'session.id': sessionId.current,
      ...commonAttributes,
      ...attributes,
    });
  }, []);

  const trackPageView = useCallback(() => {
    trackEvent('page_view', {
      'url': window.location.href,
    });
  }, [trackEvent]);

  useEffect(() => {
    trackEvent('session_start', { timestamp: new Date().toISOString() });
    trackPageView();

    const interval = setInterval(() => {
      if (!document.hidden) {
        trackEvent('session_heartbeat', {
          'duration_seconds': Math.round((Date.now() - startTime.current) / 1000),
        });
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [trackEvent, trackPageView]);

  return useMemo(() => ({ trackEvent, trackPageView }), [trackEvent, trackPageView]);
}
