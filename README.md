# Bento Node SDK

<img align="right" src="https://app.bentonow.com/brand/logoanim.gif">

> [!TIP]
> Need help? Join our [Discord](https://discord.gg/ssXXFRmt5F) or email jesse@bentonow.com for personalized support.

The Bento Node.js SDK makes it quick and easy to build an excellent analytics experience in your Node.js application. We provide powerful and customizable APIs that can be used out-of-the-box to track your users' behavior and manage subscribers. We also expose low-level APIs so that you can build fully custom experiences.

Get started with our [📚 integration guides](https://docs.bentonow.com), or [📘 browse the SDK reference](https://docs.bentonow.com/subscribers).

🐶 Battle-tested by [NativShark](https://nativshark.com) Bento Production (a Bento customer)!

❤️ Thank you @HelloKashif from [IPInfo](https://ipinfo.io) for your contribution.

❤️ Thank you @jonsherrard from [Devular](https://www.devular.com/) for your contribution.

[![Tests](https://github.com/bentonow/bento-node-sdk/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/bentonow/bento-node-sdk/actions/workflows/main.yml)

# Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Integration](#integration)
- [Modules](#modules)
- [Type Reference](#types-reference)
- [Things to know](#things-to-know)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Simple event tracking**: We make it easy for you to track user events and behavior in your application.
- **Subscriber management**: Easily add, update, and remove subscribers from your Bento account.
- **Custom fields**: Track and update custom fields for your subscribers to store additional data.
- **Purchase tracking**: Monitor customer purchases and calculate lifetime value (LTV) for your subscribers.
- **Batch operations**: Perform bulk imports of subscribers and events for efficient data management.
- **TypeScript support**: The SDK is written in TypeScript and provides type definitions for a better development experience.

## Requirements

The Bento Node.js SDK requires Node.js version 12 or later.

Bento Account for a valid **SITE_UUID**, **BENTO_PUBLISHABLE_KEY** & **BENTO_SECRET_KEY**.

## Getting started

### Installation

Install the Bento SDK in your project folder:

```bash

# Using npm
npm install @bentonow/bento-node-sdk --save

# Using Bun
bun add @bentonow/bento-node-sdk
```

### Using Bun (Recommended)

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test:coverage

# Build the package
bun run build

# Lint code
bun run lint

# Format code
bun run format
```

### Using npm

```bash
# Install dependencies
npm install

# Run tests
npm run test:npm

# Run tests with coverage
npm run test:coverage:npm

# Build the package
npm run build:npm

# Lint code
npm run lint

# Format code
npm run format
```

### Integration

Initialize the Bento client and start tracking events:

```javascript
import { Analytics } from '@bentonow/bento-node-sdk';

const bento = new Analytics({
  authentication: {
    publishableKey: 'bento-publishable-key',
    secretKey: 'bento-secret-key',
  },
  siteUuid: 'bento-site-uuid',
  // Optional: Configure request timeout (default: 30000ms)
  clientOptions: {
    timeout: 30000,
  },
});

bento.V1.track({
  email: 'user@example.com',
  type: '$formSubmitted',
  fields: {
    first_name: 'John',
    last_name: 'Doe',
  },
  details: {
    fromCustomEvent: true,
  },
}).then((result) => console.log(result));
```

## Modules

The Bento SDK provides several modules for different operations:

### Analytics (Base Module)

Core functionality for tracking events and managing subscribers.

### Convenience Helpers

#### tagSubscriber

Tags a subscriber with a specific tag.

```javascript
bento.V1.tagSubscriber({
  email: 'user@example.com',
  tagName: 'New Customer',
}).then((result) => console.log(result));
```

#### addSubscriber

Adds a new subscriber to your Bento account.

```javascript
bento.V1.addSubscriber({
  email: 'newuser@example.com',
  fields: {
    firstName: 'John',
    lastName: 'Doe',
  },
}).then((result) => console.log(result));
```

#### removeSubscriber

Removes a subscriber from your Bento account.

```javascript
bento.V1.removeSubscriber({
  email: 'user@example.com',
}).then((result) => console.log(result));
```

#### upsertSubscriber

Creates or updates a subscriber. The SDK queues the import job and then attempts to fetch
the subscriber record once the job has been accepted.

```javascript
const subscriber = await analytics.V1.upsertSubscriber({
  email: 'user@example.com',
  fields: {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Inc',
  },
  tags: 'lead,mql',
  remove_tags: 'customer',
});
```

> **Note:** Imports are processed asynchronously by Bento and may take 1-5 minutes to
> complete. If the subscriber is not yet available, the method will return `null`.

#### updateFields

Updates custom fields for a subscriber.

```javascript
bento.V1.updateFields({
  email: 'user@example.com',
  fields: {
    lastPurchaseDate: new Date(),
  },
}).then((result) => console.log(result));
```

#### track

Tracks a custom event for a subscriber.

```javascript
bento.V1.track({
  email: 'user@example.com',
  type: '$pageView',
  details: {
    url: '/products',
  },
}).then((result) => console.log(result));
```

#### trackPurchase

Tracks a purchase event for a subscriber.

```javascript
bento.V1.trackPurchase({
  email: 'user@example.com',
  purchaseDetails: {
    unique: { key: 'order-123' },
    value: { amount: 9999, currency: 'USD' },
  },
}).then((result) => console.log(result));
```

### Low Level API calls

### Batch

Perform bulk operations for importing subscribers and events.

#### importSubscribers

Imports multiple subscribers in a single operation.

```javascript
bento.V1.Batch.importSubscribers({
  subscribers: [
    { email: 'user1@example.com', firstName: 'Alice' },
    { email: 'user2@example.com', firstName: 'Bob' },
  ],
}).then((result) => console.log(result));
```

#### importEvents

Imports multiple events in a single operation.

```javascript
bento.V1.Batch.importEvents({
  events: [
    { email: 'user@example.com', type: '$login' },
    { email: 'user@example.com', type: '$pageView', details: { url: '/home' } },
  ],
}).then((result) => console.log(result));
```

### Broadcast Management

#### getBroadcasts

Retrieves all broadcasts:

```javascript
const broadcasts = await analytics.V1.Broadcasts.getBroadcasts();
```

#### createBroadcast

Creates new broadcast campaigns:

```javascript
const broadcasts = await analytics.V1.Broadcasts.createBroadcast([
  {
    name: 'Weekly Newsletter',
    subject: 'Your Weekly Update',
    content: '<p>Hi {{ name }},</p>...',
    type: 'html',
    from: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    inclusive_tags: 'lead,mql',
    exclusive_tags: 'unsubscribed',
    segment_id: 'segment_123',
    batch_size_per_hour: 1000,
  },
]);
```

### Transactional Emails

#### createEmails

Creates a new transactional email:

```javascript
const result = await bento.V1.Batch.sendTransactionalEmails({
  emails: [
    {
      to: 'recipient@example.com', // just the email, recipient name is ignored.
      from: 'sender@example.com', // MUST be an existing Author in your account (Emails -> Authors)
      subject: 'Welcome {{ name }}',
      html_body: '<p>Hello {{ name }}, welcome to our service!</p>',
      transactional: false, // Set to true to send as a transactional email IF you want to ignore if the user has unsubscribed. USE WITH CAUTION!
      personalizations: {
        name: 'John Doe',
      },
    },
  ],
});
```

### Email Structure

Each email object requires:

- **to:** Recipient email address
- **from:** Sender email address
- **subject:** Email subject (supports liquid templates)
- **html_body:** HTML email content (supports liquid templates)
- **transactional:** true/false: defaults to false, must be true to send to unsubscribed users
- **personalizations:** Optional object for liquid template variables

#### Constraints

- **Batch size:** 1-100 emails per request
- **Errors:** Throws TooFewEmailsError or TooManyEmailsError for invalid counts
- **Returns:** Number of emails successfully queued

### Statistics

#### getSiteStats

Retrieves overall site statistics:

```javascript
const stats = await analytics.V1.Stats.getSiteStats();
// Returns:
// {
//   total_subscribers: 1000,
//   active_subscribers: 950,
//   unsubscribed_count: 50,
//   broadcast_count: 25,
//   average_open_rate: 45.5,
//   average_click_rate: 12.3
// }
```

#### getSegmentStats

Retrieves statistics for a specific segment:

```javascript
const segmentStats = await analytics.V1.Stats.getSegmentStats('segment_123');
// Returns:
// {
//   segment_id: 'segment_123',
//   subscriber_count: 500,
//   growth_rate: 2.5,
//   engagement_rate: 35.8,
//   last_updated: '2024-01-01T00:00:00Z'
// }
```

#### getReportStats

Retrieves statistics for a specific report:

```javascript
const reportStats = await analytics.V1.Stats.getReportStats('report_123');
// Returns:
// {
//   report_id: 'report_123',
//   total_sent: 1000,
//   total_opens: 750,
//   unique_opens: 500,
//   total_clicks: 250,
//   unique_clicks: 200,
//   unsubscribes: 5,
//   spam_reports: 1
// }
```

### Commands

Execute specific commands for subscriber management.

#### addTag

Adds a tag to a subscriber.

```javascript
bento.V1.Commands.addTag({
  email: 'user@example.com',
  tagName: 'VIP',
}).then((result) => console.log(result));
```

#### removeTag

Removes a tag from a subscriber.

```javascript
bento.V1.Commands.removeTag({
  email: 'user@example.com',
  tagName: 'VIP',
}).then((result) => console.log(result));
```

#### addField

Adds a custom field to a subscriber.

```javascript
bento.V1.Commands.addField({
  email: 'user@example.com',
  field: {
    key: 'favoriteColor',
    value: 'blue',
  },
}).then((result) => console.log(result));
```

#### removeField

Removes a custom field from a subscriber.

```javascript
bento.V1.Commands.removeField({
  email: 'user@example.com',
  fieldName: 'favoriteColor',
}).then((result) => console.log(result));
```

### Experimental

Access experimental features (use with caution).

#### validateEmail

Attempts to validate an email address.

```javascript
bento.V1.Experimental.validateEmail({
  email: 'user@example.com',
}).then((result) => console.log(result));
```

#### guessGender

Attempts to guess the gender based on a given name.

```javascript
bento.V1.Experimental.guessGender({
  name: 'Alex',
}).then((result) => console.log(result));
```

is blacklisted:

```javascript
const blacklistStatus = await analytics.V1.Experimental.getBlacklistStatus({
  domain: 'example.com',
  // or ipAddress: '192.168.1.1'
});
```

#### getContentModeration

Performs content moderation on text:

```javascript
const moderationResult =
  await analytics.V1.Experimental.getContentModeration('Content to moderate');
// Returns:
// {
//   flagged: boolean,
//   categories: {
//     hate: boolean,
//     'hate/threatening': boolean,
//     'self-harm': boolean,
//     ...
//   },
//   category_scores: {
//     hate: number,
//     'hate/threatening': number,
//     ...
//   }
// }
```

#### geoLocateIP

Gets detailed geolocation information for an IP address:

```javascript
const location = await analytics.V1.Experimental.geoLocateIP('192.168.1.1');
// Returns:
// {
//   city_name: 'San Francisco',
//   country_name: 'United States',
//   latitude: 37.7749,
//   longitude: -122.4194,
//   ...
// }
```

### Fields

Manage custom fields for your subscribers.

#### getFields

Retrieves all custom fields defined in your Bento account.

```javascript
bento.V1.Fields.getFields().then((fields) => console.log(fields));
```

#### createField

Creates a new custom field in your Bento account.

```javascript
bento.V1.Fields.createField({
  key: 'loyaltyPoints',
}).then((result) => console.log(result));
```

### Forms

Retrieve form responses.

#### getResponses

Retrieves responses for a specific form.

```javascript
bento.V1.Forms.getResponses('form-id-123').then((responses) => console.log(responses));
```

### Subscribers

Manage individual subscribers.

#### getSubscribers

Retrieves subscriber information.

```javascript
bento.V1.Subscribers.getSubscribers({
  email: 'user@example.com',
}).then((subscriber) => console.log(subscriber));
```

#### createSubscriber

Creates a new subscriber in your Bento account.

```javascript
bento.V1.Subscribers.createSubscriber({
  email: 'newuser@example.com',
}).then((result) => console.log(result));
```

### Tags

Create and manage tags for subscriber segmentation.

#### getTags

Retrieves all tags defined in your Bento account.

```javascript
bento.V1.Tags.getTags().then((tags) => console.log(tags));
```

#### createTag

Creates a new tag in your Bento account.

```javascript
bento.V1.Tags.createTag({
  name: 'Premium Customer',
}).then((result) => console.log(result));
```

### Sequences

Sequences power drip campaigns, onboarding flows, and other time-based journeys by chaining multiple email templates with configurable delays. The SDK mirrors the public Sequences API for fetching sequences, creating new sequence emails, and updating template content. Refer to the [Sequences API docs](https://docs.bentonow.com/sequences_api#get-sequences) for full request/response details.

#### getSequences

Calls `GET /v1/fetch/sequences` and returns every sequence plus the embedded email templates and stats. Pass `{ page }` to paginate through large installs—the SDK appends `site_uuid` automatically.

```javascript
import { Analytics } from '@bentonow/bento-node-sdk';

const analytics = new Analytics({
  authentication: {
    publishableKey: process.env.BENTO_PUBLISHABLE_KEY,
    secretKey: process.env.BENTO_SECRET_KEY,
  },
  siteUuid: process.env.BENTO_SITE_UUID,
});

const sequences = await analytics.V1.Sequences.getSequences({ page: 1 });
// sequences => [
//   {
//     id: 'seq-1',
//     type: 'sequence',
//     attributes: {
//       name: 'Welcome Sequence',
//       created_at: '2024-01-01T00:00:00Z',
//       email_templates: [
//         { id: 1, subject: 'Welcome!', stats: { opened: 100, clicked: 50 } },
//         { id: 2, subject: 'Getting Started', stats: null }
//       ]
//     }
//   }
// ]
```

#### createSequenceEmail

Wraps [`POST /v1/fetch/sequences/:id/emails/templates`](https://docs.bentonow.com/sequences_api#create-sequence-email) so you can add messages to a sequence via code. Pass the sequence prefix ID (e.g., `sequence_abc123`) plus the subject/HTML and any optional delay/snippet/editor fields.

```javascript
const createdTemplate = await analytics.V1.Sequences.createSequenceEmail('sequence_abc123', {
  subject: 'Welcome to Bento',
  html: '<p>Hello {{ visitor.first_name }}</p>',
  delay_interval: 'days',
  delay_interval_count: 7,
  inbox_snippet: 'Welcome to the sequence',
  editor_choice: 'plain',
});
```

#### updateSequenceEmail

Sequence emails reuse the Email Templates resource, so updates happen through `analytics.V1.EmailTemplates.updateEmailTemplate` (the same helper documented in the [Email Templates](#email-templates) section). Only `subject` and `html` are patchable today, matching [`PATCH /v1/fetch/emails/templates/:id`](https://docs.bentonow.com/sequences_api#update-sequence-email).

```javascript
await analytics.V1.EmailTemplates.updateEmailTemplate({
  id: 12345,
  subject: 'Updated subject',
  html: '<h1>Updated HTML</h1>',
});
```

### Workflows

Workflows (a.k.a. Flows) are Bento’s automation engine for welcome journeys, abandoned-cart nudges, re-engagement loops, and other event-driven campaigns. The SDK surfaces the public Workflows API so you can inspect every flow (including the embedded email templates and their stats) straight from Node. See the [Workflows API reference](https://docs.bentonow.com/workflows_api#get-workflows) for the canonical response schema.

#### getWorkflows

Calls `GET /v1/fetch/workflows` and returns an array of workflows. Pass an optional `page` parameter to paginate through large accounts—the SDK automatically injects your `site_uuid` so you only need to provide the page number.

```javascript
import { Analytics } from '@bentonow/bento-node-sdk';

const analytics = new Analytics({
  authentication: {
    publishableKey: process.env.BENTO_PUBLISHABLE_KEY,
    secretKey: process.env.BENTO_SECRET_KEY,
  },
  siteUuid: process.env.BENTO_SITE_UUID,
});

const workflows = await analytics.V1.Workflows.getWorkflows({ page: 2 });
// workflows => [
//   {
//     id: 'wf-1',
//     type: 'workflow',
//     attributes: {
//       name: 'Abandoned Cart Recovery',
//       created_at: '2024-01-01T00:00:00Z',
//       email_templates: [
//         { id: 3, subject: 'Reminder #1', stats: { opened: 42, clicked: 10 } },
//         { id: 4, subject: 'Reminder #2', stats: null }
//       ]
//     }
//   }
// ]
```

### Email Templates

Retrieve and update email templates used in sequences and workflows. Both helpers call the public Email Templates API (`GET /v1/fetch/emails/templates/:id` and `PATCH /v1/fetch/emails/templates/:id`), and the SDK automatically injects your `site_uuid` and authentication headers. See the [Email Templates API docs](https://docs.bentonow.com/email_templates_api#get-email-template) for the canonical contract.

#### getEmailTemplate

Retrieves a single email template by ID and returns `null` when the Bento API responds with an empty payload. Use this to surface subject lines, HTML, and performance stats inside your own tooling.

```javascript
import { Analytics } from '@bentonow/bento-node-sdk';

const analytics = new Analytics({
  authentication: {
    publishableKey: process.env.BENTO_PUBLISHABLE_KEY,
    secretKey: process.env.BENTO_SECRET_KEY,
  },
  siteUuid: process.env.BENTO_SITE_UUID,
});

const template = await analytics.V1.EmailTemplates.getEmailTemplate({ id: 123 });
if (!template) {
  console.log('Template not found');
} else {
  console.log(template.attributes.subject, template.attributes.stats);
}
```

#### updateEmailTemplate

Updates an email template's subject and/or HTML content via [`PATCH /v1/fetch/emails/templates/:id`](https://docs.bentonow.com/email_templates_api#update-email-template). Only pass the fields you want to change; omitted fields stay untouched. The helper returns the updated template (`null` if Bento responds empty) and bubbles up standard SDK errors such as `NotAuthorizedError`, `RateLimitedError`, or `RequestTimeoutError`.

```javascript
import { Analytics, NotAuthorizedError } from '@bentonow/bento-node-sdk';

const analytics = new Analytics({
  authentication: {
    publishableKey: process.env.BENTO_PUBLISHABLE_KEY,
    secretKey: process.env.BENTO_SECRET_KEY,
  },
  siteUuid: process.env.BENTO_SITE_UUID,
});

try {
  const updatedTemplate = await analytics.V1.EmailTemplates.updateEmailTemplate({
    id: 123,
    subject: 'Updated Subject Line',
    html: '<p>Updated HTML content with {{ name }}</p>',
  });

  if (updatedTemplate) {
    console.log(updatedTemplate.attributes.subject);
  }
} catch (error) {
  if (error instanceof NotAuthorizedError) {
    console.error('Check your Bento credentials or site permissions.');
  } else {
    throw error;
  }
}
```

For detailed information on each module, refer to the [SDK Documentation](https://docs.bentonow.com/subscribers).

## Types Reference

This section provides a detailed reference for the types used in the Bento Node.js SDK.
AddFieldParameters `<S>`

Parameters for adding a field to a subscriber.

| Property | Type                         | Required | Description                |
| -------- | ---------------------------- | -------- | -------------------------- |
| email    | string                       | ✔️       | Subscriber's email address |
| field    | { key: keyof S; value: any } | ✔️       | Field to add               |

### AddSubscriberParameters `<S>`

Parameters for adding a new subscriber.

| Property | Type          | Required | Description                          |
| -------- | ------------- | -------- | ------------------------------------ |
| date     | Date          | ❌       | Date of subscription                 |
| email    | string        | ✔️       | Subscriber's email address           |
| fields   | Partial `<S>` | ❌       | Additional fields for the subscriber |

### AddTagParameters

Parameters for adding a tag to a subscriber.

| Property | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| email    | string | ✔️       | Subscriber's email address |
| tagName  | string | ✔️       | Name of the tag to add     |

### BatchImportEventsParameter `<S>`, `<E>`

Parameters for batch importing events.

| Property | Type                    | Required | Description               |
| -------- | ----------------------- | -------- | ------------------------- |
| events   | BentoEvent `<S>`, `<E>` | ✔️       | Array of events to import |

### BatchImportSubscribersParameter `<S>`

Parameters for batch importing subscribers.

| Property    | Type                                  | Required | Description                    |
| ----------- | ------------------------------------- | -------- | ------------------------------ |
| subscribers | ({ email: string } & Partial `<S>`)[] | ✔️       | Array of subscribers to import |

### BentoEvent `<S>`, `<E>`

Represents different types of events in Bento. It's a union of the following event types:

- BaseEvent `<E>`
- PurchaseEvent
- SubscribeEvent `<S>`
- TagEvent
- UnsubscribeEvent
- UpdateFieldsEvent `<S>`

### PurchaseDetails

Details of a purchase event.

| Property | Type                                 | Required | Description                        |
| -------- | ------------------------------------ | -------- | ---------------------------------- |
| unique   | { key: string \| number }            | ✔️       | Unique identifier for the purchase |
| value    | { currency: string; amount: number } | ✔️       | Value of the purchase              |
| cart     | PurchaseCart                         | ❌       | Additional cart details            |

### ChangeEmailParameters

Parameters for changing a subscriber's email.

| Property | Type   | Required | Description           |
| -------- | ------ | -------- | --------------------- |
| oldEmail | string | ✔️       | Current email address |
| newEmail | string | ✔️       | New email address     |

### CreateFieldParameters

Parameters for creating a new field.

| Property | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| key      | string | ✔️       | Key of the new field |

### CreateTagParameters

Parameters for creating a new tag.

| Property | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| name     | string | ✔️       | Name of the new tag |

### Subscriber `<S>`

Represents a subscriber in Bento.

| Property   | Type                       | Required | Description                  |
| ---------- | -------------------------- | -------- | ---------------------------- |
| attributes | SubscriberAttributes `<S>` | ✔️       | Attributes of the subscriber |
| id         | string                     | ✔️       | Unique identifier            |
| type       | EntityType.VISITOR         | ✔️       | Type of the entity           |

### TrackParameters `<S>`, `<E>`

Parameters for tracking an event.

| Property | Type                   | Required | Description                         |
| -------- | ---------------------- | -------- | ----------------------------------- |
| email    | string                 | ✔️       | Subscriber's email address          |
| type     | string                 | ✔️       | Type of the event                   |
| details  | { [key: string]: any } | ❌       | Additional details of the event     |
| fields   | Partial `<S>`          | ❌       | Fields to update for the subscriber |

### ValidateEmailParameters

Parameters for validating an email address.

| Property  | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| email     | string | ✔️       | Email address to validate      |
| ip        | string | ❌       | IP address of the user         |
| name      | string | ❌       | Name associated with the email |
| userAgent | string | ❌       | User agent string              |

Note: The `S` and `E` generic types are used for TypeScript support. `S` represents the type of your subscriber's custom fields, and `E` represents the prefix used for custom events. For more details, refer to the TypeScript section of the documentation.

## Things to know

- All events must be identified with an email address.
- Most events are indexed within seconds in your Bento account.
- The SDK supports TypeScript with generics for custom fields and events.
- Batch operations are available for importing subscribers and events efficiently.
- The SDK doesn't currently support anonymous events (coming soon).
- Requests have a default timeout of 30 seconds, configurable via `clientOptions.timeout`.

## Error Handling

The SDK exports several error types for specific error conditions:

```javascript
import {
  NotAuthorizedError, // 401 - Invalid credentials
  RateLimitedError, // 429 - Too many requests
  AuthorNotAuthorizedError, // Author not permitted to send emails
  RequestTimeoutError, // Request exceeded timeout
} from '@bentonow/bento-node-sdk';

try {
  await bento.V1.Tags.getTags();
} catch (error) {
  if (error instanceof RequestTimeoutError) {
    // Handle timeout - maybe retry
  } else if (error instanceof RateLimitedError) {
    // Handle rate limiting - back off and retry
  } else if (error instanceof NotAuthorizedError) {
    // Handle auth error - check credentials
  }
}
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CODE_OF_CONDUCT.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

The Bento SDK for Node.js is available as open source under the terms of the [MIT License](LICENSE.md).
