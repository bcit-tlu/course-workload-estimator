# AGENTS.md

## Setup Commands

- Install dependencies: `npm install`
- Build for production: `npm run build` (Webpack)
- Start development server: `npm start`
- Helm lint: `helm lint charts/`
- Helm validate: `helm template test charts/ | kubeconform -strict -summary -schema-location default -ignore-missing-schemas`

## Code Style

- React with Material UI (MUI)
- Follow conventional commit format for PR titles
- License: MPL-2.0

## Project Structure

- `/src` — React source code and application logic
- `/public` — Static HTML entry point and assets
- `/charts` — Helm chart for Kubernetes deployment (flat layout)
- `/conf.d` — Nginx server configuration and logging logic
- `/.github/workflows/` — CI/CD pipelines
- `/webpack.dev.js` — Webpack development configuration
- `/webpack.prod.js` — Webpack production build and compression settings

## CI/CD

- CI uses shared `bcit-tlu/.github` OCI build reusable workflow
- `helm-lint` validates Helm charts on every push and PR
- `release-please` manages versioning via conventional commits (`release-type: "simple"`)
- Version is tracked in `.release-please-manifest.json` and `Chart.yaml` (`# x-release-please-version` annotations)
- Images are published to `ghcr.io/bcit-tlu/course-workload-estimator/course-workload-estimator`
- Charts are published to `oci://ghcr.io/bcit-tlu/course-workload-estimator/charts`
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` is set in all workflows

## Deployment

- Deployed to Kubernetes via Flux CD (see `bcit-tlu/flux-fleet`)
- Ingress: `course-workload-estimator.<CLUSTER_ENV>.ltc.bcit.ca`
- Static site served by nginx-unprivileged on port 8080
