# Manual Validation Commands

This guide lists ready-to-run commands for validating the updated Workflows, Sequences, and Email Template helpers with your own Bento account. Each section uses direct API calls so you can confirm data outside the SDK, plus an optional Node script that exercises the SDK layer end-to-end.

## 1. Prerequisites

```bash
# Required credentials for both curl + SDK commands
export BENTO_PUBLISHABLE_KEY="pk_live_xxx"
export BENTO_SECRET_KEY="sk_live_xxx"
export BENTO_SITE_UUID="site_xxx"

# Optional helpers for create/update examples
export BENTO_SEQUENCE_PREFIX_ID="sequence_abc123"   # e.g., from Bento UI
export BENTO_TEMPLATE_ID="12345"                    # existing email template id
```

*All requests hit Bento’s production API (`https://app.bentonow.com/api/v1`). Set `BENTO_BASE_URL` if you need a different environment.*

**Tooling:** make sure `curl`, `jq`, `bun`, and `node` (v18+) are installed locally.

## 2. Verify Workflows (`GET /v1/fetch/workflows`)

```bash
curl -sSL -u "$BENTO_PUBLISHABLE_KEY:$BENTO_SECRET_KEY" \
  "https://app.bentonow.com/api/v1/fetch/workflows?site_uuid=$BENTO_SITE_UUID&page=1" | jq
```

Expected: JSON array of workflows with `email_templates` blocks. Adjust `page` to paginate.

## 3. Verify Sequences (`GET /v1/fetch/sequences`)

```bash
curl -sSL -u "$BENTO_PUBLISHABLE_KEY:$BENTO_SECRET_KEY" \
  "https://app.bentonow.com/api/v1/fetch/sequences?site_uuid=$BENTO_SITE_UUID&page=1" | jq
```

Confirms pagination wiring for the Sequences helper. Use the response to grab `sequence_…` IDs and template IDs.

## 4. Create Sequence Email (`POST /v1/fetch/sequences/:id/emails/templates`)

```bash
curl -sSL -u "$BENTO_PUBLISHABLE_KEY:$BENTO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  "https://app.bentonow.com/api/v1/fetch/sequences/${BENTO_SEQUENCE_PREFIX_ID}/emails/templates?site_uuid=$BENTO_SITE_UUID" \
  -d '{
    "email_template": {
      "subject": "Manual Validation Welcome",
      "html": "<h1>Hello {{ visitor.first_name }}</h1>",
      "delay_interval": "days",
      "delay_interval_count": 3,
      "inbox_snippet": "Start here",
      "editor_choice": "plain"
    }
  }' | jq
```

The response should echo the created email template. Delete or disable the template afterward if this is a production sequence.

## 5. Update Sequence Email / Template (`PATCH /v1/fetch/emails/templates/:id`)

```bash
curl -sSL -u "$BENTO_PUBLISHABLE_KEY:$BENTO_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -X PATCH \
  "https://app.bentonow.com/api/v1/fetch/emails/templates/${BENTO_TEMPLATE_ID}?site_uuid=$BENTO_SITE_UUID" \
  -d '{
    "email_template": {
      "subject": "Manual Validation Subject",
      "html": "<p>Updated via CLI validation</p>"
    }
  }' | jq
```

Use a staging template ID to avoid altering live content.

## 6. SDK Smoke Test (Optional)

```bash
bun run build >/dev/null
node docs/manual-validation.js
```

The script imports the freshly built SDK bundle from `dist`. Set `BENTO_SEQUENCE_PREFIX_ID` / `BENTO_TEMPLATE_ID` to exercise the create/update flows; leave them blank to skip.

## 7. One-Command Validation

To run all curl checks plus the SDK smoke test in one go, use the wrapper script (requires `jq`, `curl`, and optionally Bun):

```bash
chmod +x scripts/run-automation-validation.sh
./scripts/run-automation-validation.sh
```

The script skips optional steps when `BENTO_SEQUENCE_PREFIX_ID` or `BENTO_TEMPLATE_ID` are unset. It automatically runs `bun run build` before launching the SDK smoke test.

## 8. Cleanup

If you created test templates or sequences, remove them in the Bento UI or via the API to keep your automation clean. For production sites, prefer using a sandbox sequence or temporary site UUID when running the `createSequenceEmail` step.
