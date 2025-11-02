import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { NodeSDK } from "@opentelemetry/sdk-node";

function start() {
  const metricExporter = new PrometheusExporter({
    port: 9464,
  });

  const sdk = new NodeSDK({
    serviceName: "langturbo",
    metricReader: metricExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}

export default start;
