<!-- SPDX-License-Identifier: MPL-2.0 -->
# Course Workload Estimator

A time calculator to estimate the number of hours of work learners might be expected to spend completing coursework.

## Development

Run the project using Docker and then open `localhost:3000` in a browser.

```bash
docker compose up
```

## Production build (local)

Simulate the production container (nginx serving the compiled `/dist` on port `8080`) alongside a local OpenTelemetry Collector that stands in for the in-cluster collector at `opentelemetry-collector.observability.svc:4318`:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Then open `localhost:8080` in a browser. Browser analytics POSTs to `/v1/logs` are proxied by nginx to the local collector, which prints received logs to its stdout.

## Deployment

Use the build files from `/dist`.

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License

## About

Developed at BCIT's Learning and Teaching Centre in 🇨🇦 Canada.
