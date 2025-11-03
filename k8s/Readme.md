# Ops

## Prometheus

`k -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090`

## Grafana

`k -n monitoring port-forward svc/kube-prometheus-stack-grafana  3000:80`

## Meilisearch

`k port-forward svc/meilisearch-release 7700:7700 -n langturbo`

## Postgres

`k port-forward svc/postgres-cluster-rw 5432:5432 -n langturbo`

## Flux troubleshooting

`flux get kustomizations --watch`

`flux get all -A --status-selector ready=false`