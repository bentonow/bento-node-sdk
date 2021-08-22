# Bento SDK for Node.JS

[![Build Status](https://travis-ci.org/bentonow/bento-node-sdk.svg?branch=master)](https://travis-ci.org/bentonow/bento-node-sdk)

🍱 Simple, powerful analytics for Node.JS projects!

Track events, update data, record LTV and more in Ruby. Data is stored in your Bento account so you can easily research and investigate what's going on.

👋 To get personalized support, please tweet @bento or email jesse@bentonow.com!

🐶 Battle-tested on Bento Production (we dog food this package ourselves)!

## Installation

Run the following command in your project folder.

```bash
npm install @bentonow/bento-node-sdk --save
```

## Get Started

To get started with tracking things in Bento, simply initialize the client and run wild!

```ts
import { Analytics } from '@bentonow/bento-node-sdk';

const bento = new Analytics({
  authentication: {
    publishableKey: 'publishableKey',
    secretKey: 'secretKey',
  },
  siteUuid: 'siteUuid',
});

bento
  .addSubscriber({
    email: 'test@bentonow.com',
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));

bento
  .updateFields({
    email: 'test@bentonow.com',
    fields: {
      firstName: 'Test',
      lastName: 'User',
    },
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

Read on to see what all you can do with the SDK.

# Modules

In addition to the top-level Analytics object, we also provide access to other parts of the API behind their corresponding modules. You can access these off of the main `Analytics` object.

The `Analytics` module also provides access to various versions of the API (currently just `V1`), and each of those provides access to the corresponding modules documented below.

## Analytics (Base Module)

### `tagSubscriber(parameters: TagSubscriberParameters): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.addTag`](#Commands.addTag) method.

Tags a subscriber with the specified email and tag. If either the tag or the user do not exist, they will be created in the system. If the user already has the tag, another tag event will be sent, triggering any automations that take place upon a tag being added to a subscriber. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TagSubscriberParameters](#TagSubscriberParameters)

```ts
bento.tagSubscriber({
  email: 'test@bentonow.com',
  tagName: 'Test Tag',
});
```

---

### `addSubscriber(parameters: AddSubscriberParameters): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.subscribe`](#Commands.subscribe) method.

Creates a subscriber in the system. If the subscriber already exists, another subscribe event will be sent, triggering any automations that take place upon subscription. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [AddSubscriberParameters](#AddSubscriberParameters)

```ts
bento.addSubscriber({
  email: 'test@bentonow.com',
});
```

---

### `async removeSubscriber(parameters: RemoveSubscriberParameters): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.unsubscribe`](#Commands.unsubscribe) method.

Unsubscribes an email in the system. If the email is already unsubscribed, another unsubscribe event will be sent, triggering any automations that take place upon an unsubscribe happening. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [RemoveSubscriberParameters](#RemoveSubscriberParameters)

```ts
bento.removeSubscriber({
  email: 'test@bentonow.com',
});
```

---

### `updateFields(parameters: UpdateFieldsParameters<S>): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.addField`](#Commands.addField) method.

Sets the passed-in custom fields on the subscriber, creating the subscriber if it does not exist. If the fields are already set on the subscriber, the event will be sent, triggering any automations that take place upon fields being updated. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [UpdateFieldsParameters\<S\>](#UpdateFieldsParameters<S>)

```ts
bento.updateFields({
  email: 'test@bentonow.com',
  fields: {
    firstName: 'Test',
  },
});
```

---

### `trackPurchase(parameters: TrackPurchaseParameters): Promise<boolean>`

**This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering automations.

Tracks a purchase in Bento, used to calculate LTV for your subscribers. The values that are received should be numbers, in cents. For example, `$1.00` should be `100`.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TrackPurchaseParameters](#TrackPurchaseParameters)

```ts
bento.trackPurchase({
  email: 'test@bentonow.com',
  purchaseDetails: {
    unique: {
      key: 1234,
    },
    value: {
      amount: 100,
      currency: 'USD',
    },
  },
});
```

---

### `track(parameters: TrackParameters<S, E>): Promise<boolean>`

**This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering automations.

Tracks a custom event in Bento.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TrackParameters<S, E>](#TrackParameters<S,E>)

```ts
bento.track({
  email: 'test@bentonow.com',
  type: '$custom.event',
  details: {
    fromCustomEvent: true,
  },
});
```

---

## Batch

### `Batch.importSubscribers(parameters: BatchImportSubscribersParameter<S>): Promise<number>`

**This does not trigger automations!** - If you wish to trigger automations, please batch import events with the type set to `BentoEvents.SUBSCRIBE`, or `$subscribe`. Note that the batch event import cannot attach custom fields and will ignore everything except the email.

Creates a batch job to import subscribers into the system. You can pass in between 1 and 1,000 subscribers to import. Each subscriber must have an email, and may optionally have any additional fields. The additional fields are added as custom fields on the subscriber.

This method is processed by the Bento import queues and it may take between 1 and 5 minutes for the results to appear in your dashboard.

Returns the number of subscribers that were imported.

Reference Types: [BatchImportSubscribersParameter\<S\>](#BatchImportSubscribersParameter<S>)

```ts
bento.V1.Batch.importSubscribers({
  subscribers: [
    {
      email: 'test@bentonow.com',
      age: 21,
    },
    {
      email: 'test2@bentonow.com',
    },
    {
      email: 'test3@bentonow.com',
      name: 'Test User',
    },
  ],
});
```

### `Batch.importEvents(parameters: BatchImportEventsParameter<S, E>): Promise<number>`

Creates a batch job to import events into the system. You can pass in between 1 and 1,000 events to import. Each event must have an email and a type. In addition to this, you my pass in additional data in the `details` property,

Returns the number of events that were imported.

Reference Types: [BatchImportEventsParameter<S, E>](#BatchImportEventsParameter<S,E>)

```ts
bento.V1.Batch.importEvents({
  events: [
    {
      email: 'test@bentonow.com',
      type: BentoEvents.SUBSCRIBE,
    },
    {
      email: 'test@bentonow.com',
      type: BentoEvents.UNSUBSCRIBE,
    },
    {
      email: 'test@bentonow.com',
      details: {
        customData: 'Used internally.',
      },
      type: '$custom.myEvent,
    },
  ],
});
```

---

## Types References

---

### `AddSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `BatchImportEventsParameter<S,E>`

| Property | Type                                     | Default | Required |
| -------- | ---------------------------------------- | ------- | -------- |
| events   | [`BentoEvent<S, E>[]`](#BentoEvent<S,E>) | _none_  | ✔️       |

---

### `BatchImportSubscribersParameter<S>`

| Property    | Type                                 | Default | Required |
| ----------- | ------------------------------------ | ------- | -------- |
| subscribers | `({ email: string } & Partial<S>)[]` | _none_  | ✔️       |

---

### `BentoEvent<S, E>`

This type is a discriminated union of a few different types. Each of these types are documented below:

#### `BaseEvent<E>`

Note that the type below requires that it starts with the configured prefix if one was set. Please read the [TypeScript](#TypeScript) section for more details.

| Property | Type                     | Default | Required |
| -------- | ------------------------ | ------- | -------- |
| details  | `{ [key: string]: any }` | _none_  | ✔️       |
| email    | `string`                 | _none_  | ✔️       |
| type     | `string`                 | _none_  | ✔️       |

#### `PurchaseEvent`

| Property | Type                                    | Default | Required |
| -------- | --------------------------------------- | ------- | -------- |
| details  | [`PurchaseDetails`](#PurchaseDetails)   | _none_  | ✔️       |
| email    | `string`                                | _none_  | ✔️       |
| type     | `BentoEvents.PURCHASE` \| `'$purchase'` | _none_  | ✔️       |

#### `SubscribeEvent`

| Property | Type                                      | Default | Required |
| -------- | ----------------------------------------- | ------- | -------- |
| email    | `string`                                  | _none_  | ✔️       |
| type     | `BentoEvents.SUBSCRIBE` \| `'$subscribe'` | _none_  | ✔️       |

#### `TagEvent`

| Property | Type                          | Default | Required |
| -------- | ----------------------------- | ------- | -------- |
| details  | `{ tag: string }`             | _none_  | ✔️       |
| email    | `string`                      | _none_  | ✔️       |
| type     | `BentoEvents.TAG` \| `'$tag'` | _none_  | ✔️       |

#### `UnsubscribeEvent`

| Property | Type                                          | Default | Required |
| -------- | --------------------------------------------- | ------- | -------- |
| email    | `string`                                      | _none_  | ✔️       |
| type     | `BentoEvents.UNSUBSCRIBE` \| `'$unsubscribe'` | _none_  | ✔️       |

#### `UpdateFieldsEvent<S>`

| Property | Type                                              | Default | Required |
| -------- | ------------------------------------------------- | ------- | -------- |
| email    | `string`                                          | _none_  | ✔️       |
| type     | `BentoEvents.UPDATE_FIELDS` \| `'$update_fields'` | _none_  | ✔️       |
| fields   | `Partial<S>`                                      | _none_  | ✔️       |

---

### `PurchaseDetails`

| Property | Type                                    | Default | Required |
| -------- | --------------------------------------- | ------- | -------- |
| unique   | `{ key: string \| number; }`            | _none_  | ✔️       |
| value    | `{ currency: string; amount: number; }` | _none_  | ✔️       |
| cart     | [`PurchaseItem[]`](#PurchaseItem)       | _none_  | ❌       |

---

### `PurchaseItem`

| Property      | Type     | Default | Required |
| ------------- | -------- | ------- | -------- |
| product_sku   | `string` | _none_  | ❌       |
| product_name  | `string` | _none_  | ❌       |
| quantity      | `number` | _none_  | ❌       |
| product_price | `number` | _none_  | ❌       |
| product_id    | `string` | _none_  | ❌       |

---

### `RemoveSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `TagSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |
| tagName  | `string` | _none_  | ✔️       |

---

### `TrackParameters<S,E>`

The `E` from above represents the prefix that is used to define your custom events. This only applies in `TypeScript`. Please read the [TypeScript](#TypeScript) section for more details.

| Property | Type                     | Default | Required |
| -------- | ------------------------ | ------- | -------- |
| email    | `string`                 | _none_  | ✔️       |
| type     | `string`                 | _none_  | ✔️       |
| details  | `{ [key: string]: any }` | _none_  | ❌       |

---

### `TrackPurchaseParameters`

| Property        | Type                                  | Default | Required |
| --------------- | ------------------------------------- | ------- | -------- |
| email           | `string`                              | _none_  | ✔️       |
| purchaseDetails | [`PurchaseDetails`](#PurchaseDetails) | _none_  | ✔️       |

---

### `UpdateFieldsParameters<S>`

The `S` from above represents the type of your subscriber's custom fields in Bento. This only applies in `TypeScript`. Please read the [TypeScript](#TypeScript) section for more details.

| Property | Type                            | Default | Required |
| -------- | ------------------------------- | ------- | -------- |
| email    | `string`                        | _none_  | ✔️       |
| fields   | `S` \| `{ [key: string]: any }` | _none_  | ✔️       |

## TypeScript

The Bento Node SDK is written entirely in TypeScript and, as such, has first-class support for projects written in TypeScript. It takes advantage of generics to make your code more bullet-proof and reduce bugs throughout your system.

### Generics

#### `S`

The `S` generic is a type that represents the shape of the custom fields on your Bento subscribers. If this is provided, all of the methods that interact with these fields (including fetching the subscriber from the API) will be typed appropriately.

To set this type, pass it as the first generic parameter when initializing your `Analytics` object.

```ts
type MySubscriberFields = {
  firstName: string;
  lastName: string;
  age: number;
};

const bento = new Analytics<MySubscriberFields>({
  // ... initialization options from above.
});
```

#### `E`

The `E` generic is a string that represents the custom prefix used for your custom commands. This is used to ensure that you are not accidentally changing things on your subscribers that you do not intend to change. It also prevents clashes with using internal Bento events.

To set this type, pass it as the second generic parameter when initializing your `Analytics` object.

```ts
const bento = new Analytics<any, '$myPrefix.'>({
  // ... initialization options from above.
});
```

## Things to know

1. Tracking: All events must be identified. Anonymous support coming soon!
2. Tracking: Most events and indexed inside Bento within a few seconds.
3. If you need support, just let us know!

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bentonow/bento-node-sdk. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
