import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NavigationInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/navigation';
import { NavigationTimingInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/navigation-timing';
import { UserActionInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/user-action';
import { WebVitalsInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/web-vitals';
import { ErrorsInstrumentation } from '@opentelemetry/browser-instrumentation/experimental/errors';
import pkg from '../../package.json';
const { version } = pkg;

export function initAnalytics() {
  const isProduction = process.env.NODE_ENV === 'production';

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'course-workload-estimator',
    [ATTR_SERVICE_VERSION]: version,
  });

  const logExporter = isProduction
    ? new OTLPLogExporter({ url: '/v1/logs' })
    : new ConsoleLogRecordExporter();

  const processor = isProduction
    ? new BatchLogRecordProcessor(logExporter)
    : new SimpleLogRecordProcessor(logExporter);

  const loggerProvider = new LoggerProvider({
    resource,
    processors: [processor],
  });

  logs.setGlobalLoggerProvider(loggerProvider);

  registerInstrumentations({
    instrumentations: [
      new NavigationInstrumentation(),
      new NavigationTimingInstrumentation(),
      new UserActionInstrumentation(),
      new WebVitalsInstrumentation(),
      new ErrorsInstrumentation(),
    ],
  });
}

export function logEvent(eventName, attributes = {}) {
  try {
    const logger = logs.getLogger('analytics');
    logger.emit({
      body: eventName,
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      attributes: { 'event.name': eventName, ...attributes },
    });
  } catch (e) {
    // Analytics must never break the UI
  }
}
