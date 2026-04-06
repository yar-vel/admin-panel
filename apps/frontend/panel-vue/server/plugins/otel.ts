import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

let sdk: NodeSDK | null = null

export default defineNitroPlugin(() => {
  if (sdk) {
    return
  }

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'panel-vue',
    }),
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-http': {
          ignoreIncomingRequestHook: req =>
            !!(
              req.url?.startsWith('/_nuxt')
              || req.url?.startsWith('/__nuxt')
              || req.url?.includes('/health')
              || req.url?.includes('/ready')
            ),
        },
      }),
    ],
  })

  sdk.start()
  console.log('✅ OpenTelemetry SDK started for Nuxt/Nitro')

  const shutdown = () => {
    console.log('Received shutdown signal, flushing telemetry...')
    sdk
      ?.shutdown()
      .then(() => {
        console.log('✅ OpenTelemetry SDK shut down successfully')
        process.exit(0)
      })
      .catch((err) => {
        console.error('❌ Error shutting down OpenTelemetry SDK:', err)
        process.exit(1)
      })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
})
