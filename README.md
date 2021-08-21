# Bento SDK for Node.JS
[![Build Status](https://travis-ci.org/bentonow/bento-node-sdk.svg?branch=master)](https://travis-ci.org/bentonow/bento-node-sdk)

🍱 Simple, powerful analytics for Ruby/Rails projects!

Track events, update data, record LTV and more in Ruby. Data is stored in your Bento account so you can easily research and investigate what's going on.

👋 To get personalized support, please tweet @bento or email jesse@bentonow.com!

🐶 Battle-tested on Bento Production (we dog food this package ourselves)!

## Installation

Run the following command in your project folder.

```bash
npm install @bentonow/bento-node-sdk --save
```

## Usage

Then go wild tracking events!
```ts
// track a single event
analytics.track(identity: {email: "user@yourapp.com"}, event: '$action', details: {action_information: "api_test"})

// update a users custom field
analytics.track(identity: {email: "user@yourapp.com"}, event: '$update_details', custom_fields: {favourite_meal: "bento box"})

// tag a visitor
analytics.track(identity: {email: "user@yourapp.com"}, event: '$tag', details: {tag: "customer"})

// track a unique event and add LTV (example below tracks $12.34 USD)
analytics.track(identity: {email: "user@yourapp.com"}, event: '$payment', details: {value: {amount: 1234, currency: "USD"}, unique: {key: 123456}})

// track a pageview server-side
analytics.track(identity: {email: "user@yourapp.com"}, event: '$view', page: {url: "api_test", title: ""})

```


## Things to know

1. Tracking: All events must be identified. Anonymous support coming soon!
2. Tracking: Most events and indexed inside Bento within a few seconds.
3. Gem: You can stub out events by adding ENV['STUB'].
4. If you need support, just let us know!

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bentonow/bento-node-sdk. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).