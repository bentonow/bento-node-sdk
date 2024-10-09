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

Table of contents
=================


* [Features](#features)
* [Requirements](#requirements)
* [Getting started](#getting-started)
  * [Installation](#installation)
  * [Integration](#integration)
* [Modules](#modules)
* [Type Reference](#types-reference)
* [Things to know](#things-to-know)
* [Contributing](#contributing)
* [License](#license)


## Features

* **Simple event tracking**: We make it easy for you to track user events and behavior in your application.
* **Subscriber management**: Easily add, update, and remove subscribers from your Bento account.
* **Custom fields**: Track and update custom fields for your subscribers to store additional data.
* **Purchase tracking**: Monitor customer purchases and calculate lifetime value (LTV) for your subscribers.
* **Batch operations**: Perform bulk imports of subscribers and events for efficient data management.
* **TypeScript support**: The SDK is written in TypeScript and provides type definitions for a better development experience.

## Requirements

The Bento Node.js SDK requires Node.js version 12 or later.

Bento Account for a valid **SITE_UUID**, **BENTO_PUBLISHABLE_KEY** & **BENTO_SECRET_KEY**.

## Getting started

### Installation

Install the Bento SDK in your project folder:

```bash
npm install @bentonow/bento-node-sdk --save
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
}).then(result => console.log(result));
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
}).then(result => console.log(result));
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
}).then(result => console.log(result));
```

#### removeSubscriber
Removes a subscriber from your Bento account.

```javascript
bento.V1.removeSubscriber({
  email: 'user@example.com',
}).then(result => console.log(result));
```

#### updateFields
Updates custom fields for a subscriber.

```javascript
bento.V1.updateFields({
  email: 'user@example.com',
  fields: {
    lastPurchaseDate: new Date(),
  },
}).then(result => console.log(result));
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
}).then(result => console.log(result));
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
}).then(result => console.log(result));
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
}).then(result => console.log(result));
```

#### importEvents
Imports multiple events in a single operation.

```javascript
bento.V1.Batch.importEvents({
  events: [
    { email: 'user@example.com', type: '$login' },
    { email: 'user@example.com', type: '$pageView', details: { url: '/home' } },
  ],
}).then(result => console.log(result));
```

### Commands

Execute specific commands for subscriber management.

#### addTag
Adds a tag to a subscriber.

```javascript
bento.V1.Commands.addTag({
  email: 'user@example.com',
  tagName: 'VIP',
}).then(result => console.log(result));
```

#### removeTag
Removes a tag from a subscriber.

```javascript
bento.V1.Commands.removeTag({
  email: 'user@example.com',
  tagName: 'VIP',
}).then(result => console.log(result));
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
}).then(result => console.log(result));
```

#### removeField
Removes a custom field from a subscriber.

```javascript
bento.V1.Commands.removeField({
  email: 'user@example.com',
  fieldName: 'favoriteColor',
}).then(result => console.log(result));
```

### Experimental

Access experimental features (use with caution).

#### validateEmail
Attempts to validate an email address.

```javascript
bento.V1.Experimental.validateEmail({
  email: 'user@example.com',
}).then(result => console.log(result));
```

#### guessGender
Attempts to guess the gender based on a given name.

```javascript
bento.V1.Experimental.guessGender({
  name: 'Alex',
}).then(result => console.log(result));
```

### Fields

Manage custom fields for your subscribers.

#### getFields
Retrieves all custom fields defined in your Bento account.

```javascript
bento.V1.Fields.getFields().then(fields => console.log(fields));
```

#### createField
Creates a new custom field in your Bento account.

```javascript
bento.V1.Fields.createField({
  key: 'loyaltyPoints',
}).then(result => console.log(result));
```

### Forms

Retrieve form responses.

#### getResponses
Retrieves responses for a specific form.

```javascript
bento.V1.Forms.getResponses('form-id-123').then(responses => console.log(responses));
```

### Subscribers

Manage individual subscribers.

#### getSubscribers
Retrieves subscriber information.

```javascript
bento.V1.Subscribers.getSubscribers({
  email: 'user@example.com',
}).then(subscriber => console.log(subscriber));
```

#### createSubscriber
Creates a new subscriber in your Bento account.

```javascript
bento.V1.Subscribers.createSubscriber({
  email: 'newuser@example.com',
}).then(result => console.log(result));
```

### Tags

Create and manage tags for subscriber segmentation.

#### getTags
Retrieves all tags defined in your Bento account.

```javascript
bento.V1.Tags.getTags().then(tags => console.log(tags));
```

#### createTag
Creates a new tag in your Bento account.

```javascript
bento.V1.Tags.createTag({
  name: 'Premium Customer',
}).then(result => console.log(result));
```

For detailed information on each module, refer to the [SDK Documentation](https://docs.bentonow.com/subscribers).

## Types Reference

This section provides a detailed reference for the types used in the Bento Node.js SDK.
AddFieldParameters `<S>`

Parameters for adding a field to a subscriber.

| Property | Type                         | Required | Description                |
|----------|------------------------------|----------|----------------------------|
| email    | string                       | ✔️       | Subscriber's email address |
| field    | { key: keyof S; value: any } | ✔️       | Field to add               |

### AddSubscriberParameters `<S>`

Parameters for adding a new subscriber.

| Property | Type          | Required | Description                          |
|----------|---------------|----------|--------------------------------------|
| date     | Date          | ❌        | Date of subscription                 |
| email    | string        | ✔️       | Subscriber's email address           |
| fields   | Partial `<S>` | ❌        | Additional fields for the subscriber |

### AddTagParameters

Parameters for adding a tag to a subscriber.

| Property | Type   | Required | Description                |
|----------|--------|----------|----------------------------|
| email    | string | ✔️       | Subscriber's email address |
| tagName  | string | ✔️       | Name of the tag to add     |

### BatchImportEventsParameter `<S>`, `<E>`

Parameters for batch importing events.

| Property | Type                    | Required | Description               |
|----------|-------------------------|----------|---------------------------|
| events   | BentoEvent `<S>`, `<E>` | ✔️       | Array of events to import |

### BatchImportSubscribersParameter `<S>`

Parameters for batch importing subscribers.

| Property    | Type                                  | Required | Description                    |
|-------------|---------------------------------------|----------|--------------------------------|
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
|----------|--------------------------------------|----------|------------------------------------|
| unique   | { key: string \| number }            | ✔️       | Unique identifier for the purchase |
| value    | { currency: string; amount: number } | ✔️       | Value of the purchase              |
| cart     | PurchaseCart                         | ❌        | Additional cart details            |

### ChangeEmailParameters

Parameters for changing a subscriber's email.

| Property | Type   | Required | Description           |
|----------|--------|----------|-----------------------|
| oldEmail | string | ✔️       | Current email address |
| newEmail | string | ✔️       | New email address     |

### CreateFieldParameters

Parameters for creating a new field.

| Property | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| key      | string | ✔️       | Key of the new field |

### CreateTagParameters

Parameters for creating a new tag.

| Property | Type   | Required | Description         |
|----------|--------|----------|---------------------|
| name     | string | ✔️       | Name of the new tag |

### Subscriber `<S>`

Represents a subscriber in Bento.

| Property   | Type                       | Required | Description                  |
|------------|----------------------------|----------|------------------------------|
| attributes | SubscriberAttributes `<S>` | ✔️       | Attributes of the subscriber |
| id         | string                     | ✔️       | Unique identifier            |
| type       | EntityType.VISITOR         | ✔️       | Type of the entity           |

### TrackParameters `<S>`, `<E>`

Parameters for tracking an event.

| Property | Type                   | Required | Description                         |
|----------|------------------------|----------|-------------------------------------|
| email    | string                 | ✔️       | Subscriber's email address          |
| type     | string                 | ✔️       | Type of the event                   |
| details  | { [key: string]: any } | ❌        | Additional details of the event     |
| fields   | Partial `<S>`          | ❌        | Fields to update for the subscriber |

### ValidateEmailParameters

Parameters for validating an email address.

| Property  | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| email     | string | ✔️       | Email address to validate      |
| ip        | string | ❌        | IP address of the user         |
| name      | string | ❌        | Name associated with the email |
| userAgent | string | ❌        | User agent string              |

Note: The `S` and `E` generic types are used for TypeScript support. `S` represents the type of your subscriber's custom fields, and `E` represents the prefix used for custom events. For more details, refer to the TypeScript section of the documentation.


## Things to know

- All events must be identified with an email address.
- Most events are indexed within seconds in your Bento account.
- The SDK supports TypeScript with generics for custom fields and events.
- Batch operations are available for importing subscribers and events efficiently.
- The SDK doesn't currently support anonymous events (coming soon).

## Contributing

We welcome contributions! Please see our [contributing guidelines](CODE_OF_CONDUCT.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

The Bento SDK for Node.js is available as open source under the terms of the [MIT License](LICENSE.md).
