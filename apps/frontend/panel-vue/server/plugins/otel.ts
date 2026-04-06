import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'panel-vue',
  }),

  traceExporter: new OTLPTraceExporter({
    url: `http://${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'alloy:4318'}/v1/traces`,
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `http://${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'alloy:4318'}/v1/metrics`,
    }),
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

export default defineNitroPlugin((nitroApp) => {
  sdk.start()
  console.log('✅ OpenTelemetry SDK started for Nuxt/Nitro')

  nitroApp.hooks.hook('close', async () => {
    console.log('Shutting down OpenTelemetry SDK...')

    try {
      await sdk.shutdown()
      console.log('✅ OpenTelemetry SDK shut down successfully')
    }
    catch (err) {
      console.error('❌ Error during OTEL shutdown:', err)
    }
  })
})
