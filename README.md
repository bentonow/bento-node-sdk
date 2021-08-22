# Bento SDK for Node.JS

[![Build Status](https://travis-ci.org/bentonow/bento-node-sdk.svg?branch=master)](https://travis-ci.org/bentonow/bento-node-sdk)

🍱 Simple, powerful analytics for Node.JS projects!

Track events, update data, record LTV and more in Ruby. Data is stored in your Bento account so you can easily research and investigate what's going on.

👋 To get personalized support, please tweet @bento or email jesse@bentonow.com!

🐶 Battle-tested on Bento Production (we dog food this package ourselves)!

- [Installation](#Installation)
- [Get Started](#Get-Started)
- [Modules](#Modules)
  - [Analytics (Base Module)](#analytics-base-module)
    - [tagSubscriber(parameters: TagSubscriberParameters): Promise\<boolean\>](#tagsubscriberparameters-tagsubscriberparameters-promiseboolean)
    - [addSubscriber(parameters: AddSubscriberParameters): Promise\<boolean\>](#addsubscriberparameters-addsubscriberparameters-promiseboolean)
    - [removeSubscriber(parameters: RemoveSubscriberParameters): Promise\<boolean\>](#removesubscriberparameters-removesubscriberparameters-promiseboolean)
    - [updateFields(parameters: UpdateFieldsParameters\<S\>): Promise\<boolean\>](#updatefieldsparameters-updatefieldsparameterss-promiseboolean)
    - [trackPurchase(parameters: TrackPurchaseParameters): Promise\<boolean\>](#trackpurchaseparameters-trackpurchaseparameters-promiseboolean)
  - [Batch](#Batch)
    - [.importSubscribers(parameters: BatchImportSubscribersParameter\<S\>): Promise\<number\>](#batchimportsubscribersparameters-batchimportsubscribersparameters-promisenumber)
    - [.importEvents(parameters: BatchImportEventsParameter\<S, E\>): Promise\<number\>](#batchimporteventsparameters-batchimporteventsparameters-e-promisenumber)
  - [Commands](#Commands)
    - [.addTag(parameters: AddTagParameters): Promise\<Subscriber\<S\> | null\>](#commandsaddtagparameters-addtagparameters-promisesubscribers--null)
    - [.removeTag(parameters: RemoveTagParameters): Promise\<Subscriber\<S\> | null\>](#commandsremovetagparameters-removetagparameters-promisesubscribers--null)
    - [.removeField(parameters: RemoveFieldParameters\<S\>): Promise\<Subscriber\<S\> | null\>](#commandsremovefieldparameters-removefieldparameterss-promisesubscribers--null)
    - [.subscribe(parameters: SubscribeParameters): Promise\<Subscriber\<S\> | null\>](#commandssubscribeparameters-subscribeparameters-promisesubscribers--null)
    - [.unsubscribe(parameters: UnsubscribeParameters): Promise\<Subscriber\<S\> | null\>](#commandsunsubscribeparameters-unsubscribeparameters-promisesubscribers--null)
  - [Experimental](#Experimental)
    - [.validateEmail(parameters: ValidateEmailParameters): Promise\<boolean\>](#experimentalvalidateemailparameters-validateemailparameters-promiseboolean)
    - [.guessGender(parameters: GuessGenderParameters): Promise\<GuessGenderResponse\>](#experimentalguessgenderparameters-guessgenderparameters-promiseguessgenderresponse)
    - [.geolocate(parameters: GeolocateParameters): Promise\<LocationData | null\>](#experimentalgeolocateparameters-geolocateparameters-promiselocationdata--null)
    - [.checkBlacklist(parameters: BlacklistParameters): Promise\<BlacklistResponse\>](#experimentalcheckblacklistparameters-blacklistparameters-promiseblacklistresponse)
  - [Fields](#Fields)
    - [.getFields(): Promise\<Field[] | null\>](#fieldsgetfields-promisefield--null)
    - [.createField(parameters: CreateFieldParameters): Promise\<Field[] | null\>](#fieldscreatefieldparameters-createfieldparameters-promisefield--null)
  - [Forms](#Forms)
    - [.getResponses(formIdentifier: string): Promise\<FormResponse[] | null\>](#formsgetresponsesformidentifier-string-promiseformresponse--null)
  - [Subscribers](#Subscribers)
    - [.getSubscribers(parameters?: GetSubscribersParameters): Promise\<Subscriber\<S\> | null\>](#subscribersgetsubscribersparameters-getsubscribersparameters-promisesubscribers--null)
    - [.createSubscriber(parameters: CreateSubscriberParameters): Promise\<Subscriber\<S\> | null\>](#subscriberscreatesubscriberparameters-createsubscriberparameters-promisesubscribers--null)
  - [Tags](#Tags)
    - [.getTags(): Promise\<Tag[] | null\>](#tagsgettags-promisetag--null)
    - [.createTag(parameters: CreateTagParameters): Promise\<Tag[] | null\>](#tagscreatetagparameters-createtagparameters-promisetag--null)
- [Types Reference](#Types-Reference)
  - [AddFieldParameters\<S\>](#addfieldparameterss)
  - [AddSubscriberParameters](#AddSubscriberParameters)
  - [AddTagParameters](#AddTagParameters)
  - [BatchImportEventsParameter\<S, E\>](#batchimporteventsparameterse)
  - [BatchImportSubscribersParameter\<S\>](#batchimportsubscribersparameters)
  - [BentoEvent\<S, E\>](#bentoevents-e)
    - [BaseEvent\<E\>](#baseevente)
    - [PurchaseEvent](#PurchaseEvent)
    - [SubscribeEvent](#SubscribeEvent)
    - [TagEvent](#TagEvent)
    - [UnsubscribeEvent](#UnsubscribeEvent)
    - [UpdateFieldsEvent\<S\>](#updatefieldsevents)
  - [BlacklistParameters](#BlacklistParameters)
  - [BlacklistResponse](#BlacklistResponse)
  - [BrowserData](#BrowserData)
  - [CreateFieldParameters](#CreateFieldParameters)
  - [CreateSubscriberParameters](#CreateSubscriberParameters)
  - [CreateTagParameters](#CreateTagParameters)
  - [EntityType](#EntityType)
  - [Field](#Field)
  - [FieldAttributes](#FieldAttributes)
  - [FormResponse](#FormResponse)
  - [FormResponseAttributes](#FormResponseAttributes)
  - [FormResponseData](#FormResponseData)
  - [GetSubscribersParameters](#GetSubscribersParameters)
  - [GeolocateParameters](#GeolocateParameters)
  - [GuessGenderParameters](#GuessGenderParameters)
  - [GuessGenderResponse](#GuessGenderResponse)
  - [IdentityData](#IdentityData)
  - [LocationData](#LocationData)
  - [PageData](#PageData)
  - [PurchaseDetails](#PurchaseDetails)
  - [PurchaseItem](#PurchaseItem)
  - [RemoveFieldParameters\<S\>](#removefieldparameterss)
  - [RemoveSubscriberParameters](#RemoveSubscriberParameters)
  - [RemoveTagParameters](#RemoveTagParameters)
  - [SubscribeParameters](#SubscribeParameters)
  - [Subscriber\<S\>](#subscribers)
  - [SubscriberAttributes\<S\>](#subscriberattributess)
  - [Tag](#Tag)
  - [TagAttributes](#TagAttributes)
  - [TagSubscriberParameters](#TagSubscriberParameters)
  - [TrackParameters\<S, E\>](#trackparametersse)
  - [TrackPurchaseParameters](#TrackPurchaseParameters)
  - [UnsubscribeParameters](#UnsubscribeParameters)
  - [UpdateFieldsParameters\<S\>](#updatefieldsparameterss)
  - [ValidateEmailParameters](#ValidateEmailParameters)
- [TypeScript](#TypeScript)
  - [Generics](#Generics)
    - [S](#s)
    - [E](#e)
- [Things to Know](#Things-to-Know)
- [Contributing](#Contributing)
- [License](#License)

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

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.addTag`](#commandsaddtagparameters-addtagparameters-promisesubscribers--null) method.

Tags a subscriber with the specified email and tag. If either the tag or the user do not exist, they will be created in the system. If the user already has the tag, another tag event will be sent, triggering any automations that take place upon a tag being added to a subscriber. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TagSubscriberParameters](#TagSubscriberParameters)

```ts
bento
  .tagSubscriber({
    email: 'test@bentonow.com',
    tagName: 'Test Tag',
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `addSubscriber(parameters: AddSubscriberParameters): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.subscribe`](#commandssubscribeparameters-subscribeparameters-promisesubscribers--null) method.

Creates a subscriber in the system. If the subscriber already exists, another subscribe event will be sent, triggering any automations that take place upon subscription. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [AddSubscriberParameters](#AddSubscriberParameters)

```ts
bento
  .addSubscriber({
    email: 'test@bentonow.com',
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `removeSubscriber(parameters: RemoveSubscriberParameters): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.unsubscribe`](#commandsunsubscribeparameters-unsubscribeparameters-promisesubscribers--null) method.

Unsubscribes an email in the system. If the email is already unsubscribed, another unsubscribe event will be sent, triggering any automations that take place upon an unsubscribe happening. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [RemoveSubscriberParameters](#RemoveSubscriberParameters)

```ts
bento
  .removeSubscriber({
    email: 'test@bentonow.com',
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `updateFields(parameters: UpdateFieldsParameters<S>): Promise<boolean>`

**This TRIGGERS automations!** - If you do not wish to trigger automations, please use the [`Commands.addField`](#commandsaddfieldparameters-addfieldparameterss-promisesubscribers--null) method.

Sets the passed-in custom fields on the subscriber, creating the subscriber if it does not exist. If the fields are already set on the subscriber, the event will be sent, triggering any automations that take place upon fields being updated. Please be aware of the potential consequences.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [UpdateFieldsParameters\<S\>](#updatefieldsparameterss)

```ts
bento
  .updateFields({
    email: 'test@bentonow.com',
    fields: {
      firstName: 'Test',
    },
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `trackPurchase(parameters: TrackPurchaseParameters): Promise<boolean>`

**This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering automations.

Tracks a purchase in Bento, used to calculate LTV for your subscribers. The values that are received should be numbers, in cents. For example, `$1.00` should be `100`.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TrackPurchaseParameters](#TrackPurchaseParameters)

```ts
bento
  .trackPurchase({
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
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `track(parameters: TrackParameters<S, E>): Promise<boolean>`

**This TRIGGERS automations!** - There is no way to achieve this same behavior without triggering automations.

Tracks a custom event in Bento.

Because this method uses the batch API, the tag may take between 1 and 3 minutes to appear in the system.

Returns `true` if the event was successfully dispatched. Returns `false` otherwise.

Reference Types: [TrackParameters<S, E>](#trackparametersse)

```ts
bento
  .track({
    email: 'test@bentonow.com',
    type: '$custom.event',
    details: {
      fromCustomEvent: true,
    },
  })
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Batch

### `Batch.importSubscribers(parameters: BatchImportSubscribersParameter<S>): Promise<number>`

**This does not trigger automations!** - If you wish to trigger automations, please batch import events with the type set to `BentoEvents.SUBSCRIBE`, or `$subscribe`. Note that the batch event import cannot attach custom fields and will ignore everything except the email.

Creates a batch job to import subscribers into the system. You can pass in between 1 and 1,000 subscribers to import. Each subscriber must have an email, and may optionally have any additional fields. The additional fields are added as custom fields on the subscriber.

This method is processed by the Bento import queues and it may take between 1 and 5 minutes for the results to appear in your dashboard.

Returns the number of subscribers that were imported.

Reference Types: [BatchImportSubscribersParameter\<S\>](#batchimportsubscribersparameters)

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
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Batch.importEvents(parameters: BatchImportEventsParameter<S, E>): Promise<number>`

Creates a batch job to import events into the system. You can pass in between 1 and 1,000 events to import. Each event must have an email and a type. In addition to this, you my pass in additional data in the `details` property,

Returns the number of events that were imported.

Reference Types: [BatchImportEventsParameter<S, E>](#batchimporteventsparameterse)

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
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Commands

### `Commands.addTag(parameters: AddTagParameters): Promise<Subscriber<S> | null>`

**This does not trigger automations!** - If you wish to trigger automations, please use the core module's `tagSubscriber` method.

Adds a tag to the subscriber with the matching email.

Note that both the tag and the subscriber will be created if either is missing from system.

Reference Types: [AddTagParameters](#AddTagParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.addTag({
  email: 'test@bentonow.com',
  tagName: 'Test Tag',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Commands.removeTag(parameters: RemoveTagParameters): Promise<Subscriber<S> | null>`

Removes the specified tag from the subscriber with the matching email.

Reference Types: [RemoveTagParameters](#RemoveTagParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.removeTag({
  email: 'test@bentonow.com',
  tagName: 'Test Tag',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Commands.addField(parameters: AddFieldParameters<S>): Promise<Subscriber<S> | null>`

**This does not trigger automations!** - If you wish to trigger automations, please use the core module's `updateFields` method.

Adds a field to the subscriber with the matching email.

Note that both the field and the subscriber will be created if either is missing from system.

Reference Types: [AddFieldParameters\<S\>](#addfieldparameterss), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.addField({
  email: 'test@bentonow.com',
  field: {
    key: 'testKey',
    value: 'testValue',
  },
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Commands.removeField(parameters: RemoveFieldParameters<S>): Promise<Subscriber<S> | null>`

Removes a field to the subscriber with the matching email.

Reference Types: [RemoveFieldParameters\<S\>](#removefieldparameterss), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.removeField({
  email: 'test@bentonow.com',
  fieldName: 'testField',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Commands.subscribe(parameters: SubscribeParameters): Promise<Subscriber<S> | null>`

**This does not trigger automations!** - If you wish to trigger automations, please use the core module's `addSubscriber` method.

Subscribes the supplied email to Bento. If the email does not exist, it is created.

If the subscriber had previously unsubscribed, they will be re-subscribed.

Reference Types: [SubscribeParameters](#SubscribeParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.subscribe({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Commands.unsubscribe(parameters: UnsubscribeParameters): Promise<Subscriber<S> | null>`

**This does not trigger automations!** - If you wish to trigger automations, please use the core module's `removeSubscriber` method.

Unsubscribes the supplied email to Bento. If the email does not exist, it is created and immediately unsubscribed. If they had already unsubscribed, the `unsubscribed_at` property is updated.

Reference Types: [UnsubscribeParameters](#UnsubscribeParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Commands.unsubscribe({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Experimental

### `Experimental.validateEmail(parameters: ValidateEmailParameters): Promise<boolean>`

**EXPERIMENTAL** - This functionality is experimental and may change or stop working at any time.

Attempts to validate the email. You can provide additional information to further refine the validation.

If a name is provided, it compares it against the US Census Data, and so the results may be biased.

Reference Types: [ValidateEmailParameters](#ValidateEmailParameters)

```ts
bento.V1.Experimental.validateEmail({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Experimental.guessGender(parameters: GuessGenderParameters): Promise<GuessGenderResponse>`

**EXPERIMENTAL** - This functionality is experimental and may change or stop working at any time.

Attempts to guess the gender of the person given a provided name. It compares the name against the US Census Data, and so the results may be biased.

It is possible for the gender to be unknown if the system cannot confidently conclude what gender it may be.

Reference Types: [GuessGenderParameters](#GuessGenderParameters), [GuessGenderResponse](#GuessGenderResponse)

```ts
bento.V1.Experimental.guessGender({
  name: 'Jesse',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Experimental.geolocate(parameters: GeolocateParameters): Promise<LocationData | null>`

**EXPERIMENTAL** - This functionality is experimental and may change or stop working at any time.

Attempts to provide location data given a provided IP address.

Reference Types: [GeolocateParameters](#GeolocateParameters), [LocationData](#LocationData)

```ts
bento.V1.Experimental.geolocate({
  ip: '127.0.0.1',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Experimental.checkBlacklist(parameters: BlacklistParameters): Promise<BlacklistResponse>`

**EXPERIMENTAL** - This functionality is experimental and may change or stop working at any time.

Looks up the provided URL or IP Address against various blacklists to see if the site has been blacklisted anywhere.

Reference Types: [BlacklistParameters](#BlacklistParameters), [BlacklistResponse](#BlacklistResponse)

```ts
bento.V1.Experimental.checkBlacklist({
  domain: 'bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Fields

### `Fields.getFields(): Promise<Field[] | null>`

Returns all of the fields for the site.

Reference Types: [Field](#Field)

```ts
bento.V1.Experimental.validateEmail({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Fields.createField(parameters: CreateFieldParameters): Promise<Field[] | null>`

Creates a field inside of Bento. The name of the field is automatically generated from the key that is passed in upon creation. For example:

| Key               | Name              |
| ----------------- | ----------------- |
| `'thisIsAKey'`    | `'This Is A Key'` |
| `'this is a key'` | `'This Is A Key'` |
| `'this-is-a-key'` | `'This Is A Key'` |
| `'this_is_a_key'` | `'This Is A Key'` |

Reference Types: [CreateFieldParameters](#CreateFieldParameters), [Field](#Field)

```ts
bento.V1.Fields.createField({
  key: 'testKey',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Forms

### `Forms.getResponses(formIdentifier: string): Promise<FormResponse[] | null>`

Returns all of the responses for the form with the specified identifier.

Reference Types: [FormResponse](#FormResponse)

```ts
bento.V1.Forms.getResponses('test-formid-1234')
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Subscribers

### `Subscribers.getSubscribers(parameters?: GetSubscribersParameters): Promise<Subscriber<S> | null>`

Returns the subscriber with the specified email or UUID.

Reference Types: [GetSubscribersParameters](#GetSubscribersParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Subscribers.getSubscribers({
  uuid: '1234',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));

bento.V1.Subscribers.getSubscribers({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Subscribers.createSubscriber(parameters: CreateSubscriberParameters): Promise<Subscriber<S> | null>`

Creates a subscriber inside of Bento.

Reference Types: [CreateSubscriberParameters](#CreateSubscriberParameters), [Subscriber\<S\>](#subscribers)

```ts
bento.V1.Subscribers.createSubscriber({
  email: 'test@bentonow.com',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Tags

### `Tags.getTags(): Promise<Tag[] | null>`

Returns all of the fields for the site.

Reference Types: [Tag](#Tag)

```ts
bento.V1.Tags.getTags()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

---

### `Tags.createTag(parameters: CreateTagParameters): Promise<Tag[] | null>`

Creates a tag inside of Bento.

Reference Types: [Tag](#Tag)

```ts
bento.V1.Tags.createTag({
  name: 'test tag',
})
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Types References

### `AddFieldParameters<S>`

Note that this type employs the use of generics. Please read the [TypeScript](#TypeScript) section for more details.

| Property | Type                           | Default | Required |
| -------- | ------------------------------ | ------- | -------- |
| email    | `string`                       | _none_  | ✔️       |
| field    | `{ key: keyof S; value: any }` | _none_  | ✔️       |

---

### `AddSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `AddTagParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |
| tagName  | `string` | _none_  | ✔️       |

---

### `BatchImportEventsParameter<S, E>`

| Property | Type                                      | Default | Required |
| -------- | ----------------------------------------- | ------- | -------- |
| events   | [`BentoEvent<S, E>[]`](#BentoEvent<S, E>) | _none_  | ✔️       |

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

### `BlacklistParameters`

Note that this takes either `domain` _or_ `ip`, but never both.

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| domain   | `string` | _none_  | ✔️       |

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| ip       | `string` | _none_  | ✔️       |

---

### `BlacklistResponse`

The results is an object where the key is the name of the blacklist that was checked, and the value is whether or not the domain/IP appeared on that blacklist.

| Property    | Type                         | Default | Required |
| ----------- | ---------------------------- | ------- | -------- |
| description | `string`                     | _none_  | ✔️       |
| query       | `string`                     | _none_  | ✔️       |
| results     | `{ [key: string]: boolean }` | _none_  | ✔️       |

---

### `BrowserData`

| Property   | Type     | Default | Required |
| ---------- | -------- | ------- | -------- |
| height     | `string` | _none_  | ✔️       |
| user_agent | `string` | _none_  | ✔️       |
| width      | `string` | _none_  | ✔️       |

---

### `CreateFieldParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| key      | `string` | _none_  | ✔️       |

---

### `CreateSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

### `CreateTagParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| name     | `string` | _none_  | ✔️       |

---

### `EntityType`

This is an enum with the following values:

| Name            | Value               |
| --------------- | ------------------- |
| EVENTS          | `'events'`          |
| TAGS            | `'tags'`            |
| VISITORS        | `'visitors'`        |
| VISITORS_FIELDS | `'visitors-fields'` |

---

### `Field`

| Property   | Type                                        | Default | Required |
| ---------- | ------------------------------------------- | ------- | -------- |
| attributes | [`FieldAttributes`](#FieldAttributes)       | _none_  | ✔️       |
| id         | `string`                                    | _none_  | ✔️       |
| type       | [`EntityType.VISITORS_FIELDS`](#EntityType) | _none_  | ✔️       |

---

### `FieldAttributes`

| Property    | Type                | Default | Required |
| ----------- | ------------------- | ------- | -------- |
| created_at  | `string`            | _none_  | ✔️       |
| key         | `string`            | _none_  | ✔️       |
| name        | `string`            | _none_  | ✔️       |
| whitelisted | `boolean` \| `null` | _none_  | ✔️       |

---

### `FormResponse`

| Property   | Type                                                | Default | Required |
| ---------- | --------------------------------------------------- | ------- | -------- |
| attributes | [`FormResponseAttributes`](#FormResponseAttributes) | _none_  | ✔️       |
| id         | `string`                                            | _none_  | ✔️       |
| type       | [`EntityType.EVENTS`](#EntityType)                  | _none_  | ✔️       |

---

### `FormResponseAttributes`

| Property | Type                                    | Default | Required |
| -------- | --------------------------------------- | ------- | -------- |
| data     | [`FormResponseData`](#FormResponseData) | _none_  | ✔️       |
| uuid     | `string`                                | _none_  | ✔️       |

---

### `FormResponseData`

| Property | Type                            | Default | Required |
| -------- | ------------------------------- | ------- | -------- |
| browser  | [`BrowserData`](#BrowserData)   | _none_  | ✔️       |
| date     | `string`                        | _none_  | ✔️       |
| details  | `{ [key: string]: any }`        | _none_  | ✔️       |
| fields   | `{ [key: string]: any }`        | _none_  | ✔️       |
| id       | `string`                        | _none_  | ✔️       |
| identity | [`IdentityData`](#IdentityData) | _none_  | ✔️       |
| ip       | `string`                        | _none_  | ✔️       |
| location | [`LocationData`](#LocationData) | _none_  | ✔️       |
| page     | [`PageData`](#PageData)         | _none_  | ✔️       |
| site     | `string`                        | _none_  | ✔️       |
| type     | `string`                        | _none_  | ✔️       |
| visit    | `string`                        | _none_  | ✔️       |
| visitor  | `string`                        | _none_  | ✔️       |

---

### `GetSubscribersParameters`

Note that this takes either `email` _or_ `uuid`, but never both.

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| uuid     | `string` | _none_  | ✔️       |

---

### `GeolocateParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| ip       | `string` | _none_  | ✔️       |

---

### `GuessGenderParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| name     | `string` | _none_  | ✔️       |

---

### `GuessGenderResponse`

| Property   | Type               | Default | Required |
| ---------- | ------------------ | ------- | -------- |
| confidence | `number` \| `null` | _none_  | ✔️       |
| gender     | `string` \| `null` | _none_  | ✔️       |

---

### `IdentityData`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `LocationData`

| Property         | Type     | Default | Required |
| ---------------- | -------- | ------- | -------- |
| city_name        | `string` | _none_  | ❌       |
| continent_code   | `string` | _none_  | ❌       |
| country_code2    | `string` | _none_  | ❌       |
| country_code3    | `string` | _none_  | ❌       |
| country_name     | `string` | _none_  | ❌       |
| ip               | `string` | _none_  | ❌       |
| latitude         | `number` | _none_  | ❌       |
| longitude        | `number` | _none_  | ❌       |
| postal_code      | `string` | _none_  | ❌       |
| real_region_name | `string` | _none_  | ❌       |
| region_name      | `string` | _none_  | ❌       |
| request          | `string` | _none_  | ❌       |

---

### `PageData`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| host     | `string` | _none_  | ✔️       |
| path     | `string` | _none_  | ✔️       |
| protocol | `string` | _none_  | ✔️       |
| referrer | `string` | _none_  | ✔️       |
| url      | `string` | _none_  | ✔️       |

---

### `PurchaseDetails`

| Property | Type                                    | Default | Required |
| -------- | --------------------------------------- | ------- | -------- |
| unique   | `{ key: string \| number; }`            | _none_  | ✔️       |
| value    | `{ currency: string; amount: number; }` | _none_  | ✔️       |
| cart     | [`PurchaseItem[]`](#PurchaseItem)       | _none_  | ❌       |

---

### `PurchaseItem`

In addition to the properties below, you can pass any other properties that you want as part of the `PurchaseItem`.

| Property      | Type     | Default | Required |
| ------------- | -------- | ------- | -------- |
| product_sku   | `string` | _none_  | ❌       |
| product_name  | `string` | _none_  | ❌       |
| quantity      | `number` | _none_  | ❌       |
| product_price | `number` | _none_  | ❌       |
| product_id    | `string` | _none_  | ❌       |

---

### `RemoveFieldParameters<S>`

Note that this type employs the use of generics. Please read the [TypeScript](#TypeScript) section for more details.

| Property  | Type      | Default | Required |
| --------- | --------- | ------- | -------- |
| email     | `string`  | _none_  | ✔️       |
| fieldName | `keyof S` | _none_  | ✔️       |

---

### `RemoveSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `RemoveTagParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |
| tagName  | `string` | _none_  | ✔️       |

---

### `SubscribeParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `Subscriber<S>`

Note that this type employs the use of generics. Please read the [TypeScript](#TypeScript) section for more details.

| Property   | Type                                                | Default | Required |
| ---------- | --------------------------------------------------- | ------- | -------- |
| attributes | [`SubscriberAttributes<S>`](#subscriberattributess) | _none_  | ✔️       |
| id         | `string`                                            | _none_  | ✔️       |
| type       | [`EntityType.VISITOR`](#EntityType)                 | _none_  | ✔️       |

### `SubscriberAttributes<S>`

Note that this type employs the use of generics. Please read the [TypeScript](#TypeScript) section for more details.

| Property        | Type          | Default | Required |
| --------------- | ------------- | ------- | -------- |
| cached_tag_ids  | `string[]`    | _none_  | ✔️       |
| email           | `string`      | _none_  | ✔️       |
| fields          | `S` \| `null` | _none_  | ✔️       |
| unsubscribed_at | `string`      | _none_  | ✔️       |
| uuid            | `string`      | _none_  | ✔️       |

### `Tag`

| Property     | Type               | Default | Required |
| ------------ | ------------------ | ------- | -------- |
| created_at   | `string`           | _none_  | ✔️       |
| discarded_at | `string` \| `null` | _none_  | ✔️       |
| name         | `string` \| `null` | _none_  | ✔️       |
| site_id      | `string`           | _none_  | ✔️       |

---

### `TagAttributes`

| Property   | Type                              | Default | Required |
| ---------- | --------------------------------- | ------- | -------- |
| attributes | [`TagAttributes`](#TagAttributes) | _none_  | ✔️       |
| id         | `string`                          | _none_  | ✔️       |
| type       | [`EntityType.TAG`](#EntityType)   | _none_  | ✔️       |

---

### `TagSubscriberParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |
| tagName  | `string` | _none_  | ✔️       |

---

### `TrackParameters<S, E>`

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

### `UnsubscribeParameters`

| Property | Type     | Default | Required |
| -------- | -------- | ------- | -------- |
| email    | `string` | _none_  | ✔️       |

---

### `UpdateFieldsParameters<S>`

The `S` from above represents the type of your subscriber's custom fields in Bento. This only applies in `TypeScript`. Please read the [TypeScript](#TypeScript) section for more details.

| Property | Type                            | Default | Required |
| -------- | ------------------------------- | ------- | -------- |
| email    | `string`                        | _none_  | ✔️       |
| fields   | `S` \| `{ [key: string]: any }` | _none_  | ✔️       |

---

### `ValidateEmailParameters`

| Property  | Type     | Default | Required |
| --------- | -------- | ------- | -------- |
| email     | `string` | _none_  | ✔️       |
| ip        | `string` | _none_  | ❌       |
| name      | `string` | _none_  | ❌       |
| userAgent | `string` | _none_  | ❌       |

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

This package is private and all code belongs to Jacob Foster until payment is received and it is transfered to Bento.
