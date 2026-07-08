# Changelog

## 2.0.0 - 2026-06-10

### Added
- Added `getAdsStats` for ads attribution statistics, including optional filters for date range, channel, campaign, and ad identifiers.
- Exported ads statistics request and response types for TypeScript consumers.

### Changed
- Removed the unused Jest dev toolchain in favor of Bun's native test runner.
- Pinned development dependency versions and added Bun/npm install guardrails for exact installs with a 7-day release age gate.
- Documented Node 18, Bun 1.3, and npm 11.10 requirements for contributor workflows and release-age policies.
- Refreshed Bun and npm lockfiles for the production npm release.

## 2.0.0 - 2026-05-22

### Changed
- Removed the unused Jest dev toolchain in favor of the existing Bun test runner, eliminating deprecated dev-only transitive packages.
- Pinned development dependency versions and added Bun/npm install guardrails for exact installs with a 7-day release age gate.
- Refreshed Bun and npm lockfiles for the production npm release.

### Notes
- No runtime SDK source, public exports, request behavior, or package runtime dependencies changed.

## 2.0.0 - 2026-02-25

### Added
- Documented the Email Templates GET and PATCH helpers in the README, including code samples, error-handling guidance, and references to the public Email Templates API.
- Documented the Workflows helper, added pagination support for `getWorkflows`, and extended tests to cover query parameters and automation stats.
- Expanded the Sequences section with API references, pagination for `getSequences`, create/update examples, and regression tests around pagination.
