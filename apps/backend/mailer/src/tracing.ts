import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'mailer',
  }),
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: (req) =>
          !!(
            req.url?.includes('/health') ||
            req.url?.includes('/metrics') ||
            req.url?.includes('/ready')
          ),
      },
    }),
  ],
});

export function startOtel() {
  try {
    sdk.start();
    console.log('✅ OpenTelemetry SDK started successfully');
  } catch (error) {
    console.error('❌ Failed to start OpenTelemetry SDK:', error);
  }

  const shutdown = () => {
    console.log('Received shutdown signal, flushing telemetry...');
    sdk
      .shutdown()
      .then(() => {
        console.log('✅ OpenTelemetry SDK shut down successfully');
        process.exit(0);
      })
      .catch((err) => {
        console.error('❌ Error shutting down OpenTelemetry SDK:', err);
        process.exit(1);
      });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startOtel();
