#!/usr/bin/env bash
set -euo pipefail

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: $name" >&2
    exit 1
  fi
}

require_env "BENTO_PUBLISHABLE_KEY"
require_env "BENTO_SECRET_KEY"
require_env "BENTO_SITE_UUID"

PAGE="${BENTO_VALIDATION_PAGE:-1}"
BASE_URL="${BENTO_BASE_URL:-https://app.bentonow.com/api/v1}"
AUTH="${BENTO_PUBLISHABLE_KEY}:${BENTO_SECRET_KEY}"

header() {
  echo
  echo "== $1 =="
}

curl_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"

  if [[ -n "$body" ]]; then
    curl -sSL -u "$AUTH" \
      -H "Content-Type: application/json" \
      -X "$method" \
      "$url" \
      -d "$body" | jq
  else
    curl -sSL -u "$AUTH" \
      -X "$method" \
      "$url" | jq
  fi
}

header "Workflows (page $PAGE)"
curl_json GET "$BASE_URL/fetch/workflows?site_uuid=$BENTO_SITE_UUID&page=$PAGE"

header "Sequences (page $PAGE)"
curl_json GET "$BASE_URL/fetch/sequences?site_uuid=$BENTO_SITE_UUID&page=$PAGE"

if [[ -n "${BENTO_SEQUENCE_PREFIX_ID:-}" ]]; then
  header "Create Sequence Email (sequence: $BENTO_SEQUENCE_PREFIX_ID)"
  curl_json POST "$BASE_URL/fetch/sequences/${BENTO_SEQUENCE_PREFIX_ID}/emails/templates?site_uuid=$BENTO_SITE_UUID" \
    '{
      "email_template": {
        "subject": "CLI Validation Sequence Email",
        "html": "<p>Generated at '$(date -u +%FT%TZ)'</p>",
        "delay_interval": "days",
        "delay_interval_count": 1,
        "editor_choice": "plain"
      }
    }'
else
  echo "Skipping sequence email creation (set BENTO_SEQUENCE_PREFIX_ID to enable)."
fi

if [[ -n "${BENTO_TEMPLATE_ID:-}" ]]; then
  header "Update Template (id: $BENTO_TEMPLATE_ID)"
  curl_json PATCH "$BASE_URL/fetch/emails/templates/${BENTO_TEMPLATE_ID}?site_uuid=$BENTO_SITE_UUID" \
    '{
      "email_template": {
        "subject": "CLI Validation Update",
        "html": "<p>Updated at '$(date -u +%FT%TZ)'</p>"
      }
    }'
else
  echo "Skipping template update (set BENTO_TEMPLATE_ID to enable)."
fi

header "SDK Smoke Test"
if command -v bun >/dev/null 2>&1; then
  header "SDK Smoke Test"
  bun run build >/dev/null
  node docs/manual-validation.js
else
  echo "bun not found; skipping SDK script. Install Bun to run this step."
fi
