# AGENTS.md

## Setup Commands

- Install dependencies: `npm install`
- Build for production: `npm run build` (Webpack)
- Start development server: `npm start`
- Helm lint: `helm lint charts/`
- Helm validate: `helm template test charts/ | kubeconform -strict -summary -schema-location default -ignore-missing-schemas`
- Verify CDN rewrite initContainer: `bash tests/helm-cdn-rewrite.sh` (needs helm + yq)

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

## Development Workflow

- Create feature branches from `main`
- Use pull requests for code review
- PR titles must follow conventional commit format (enforced by `pr-title-lint.yaml`)
- Squash commits before merging

## CI/CD

- CI uses shared `bcit-tlu/.github` OCI build reusable workflow
- `helm-lint` validates Helm charts on every push and PR
- `release-please` manages versioning via conventional commits (`release-type: "simple"`)
- Version is tracked in `.release-please-manifest.json` and `Chart.yaml` (`# x-release-please-version` annotations)
- Images are published to `ghcr.io/bcit-tlu/course-workload-estimator/course-workload-estimator`
- Charts are published to `oci://ghcr.io/bcit-tlu/course-workload-estimator/charts`
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` is set in all workflows

### CDN channel isolation

- Latest and stable assets live in separate **storage accounts** (communal `CDN_ACCOUNT_NAME_LATEST`/`CDN_ACCOUNT_NAME_STABLE`); the channel boundary is at the account level
- The repo's container is `course-workload-estimator` on both accounts; public path is `/<repo>/<sha>/` on the per-env Front Door endpoints (`CDN_BASE_URL_{LATEST,STABLE}`)
- `ci.yaml` uploads to the latest account on every `main` push; `helm-publish.yaml` rebuilds dist at the release tag and uploads to the stable account (the endpoint hostname is baked into rewritten asset URLs, so a blob copy is not possible)

## Deployment

- Deployed to Kubernetes via Flux CD (see `bcit-tlu/flux-fleet`)
- Ingress: `course-workload-estimator.<CLUSTER_ENV>.ltc.bcit.ca`
- Static site served by nginx-unprivileged on port 8080

### Container/runtime

- `experiments.html: false` is set in `webpack.dev.js`/`webpack.prod.js` because webpack >=5.109's built-in HTML modules re-minify html-webpack-plugin output and drop attribute quotes, which breaks the CDN rewrite.
