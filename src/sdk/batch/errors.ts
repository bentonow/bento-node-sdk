export class TooFewSubscribersError extends Error {
  constructor(message = 'Too few subscribers') {
    super(message);
    this.name = 'TooFewSubscribersError';
  }
}

export class TooManySubscribersError extends Error {
  constructor(message = 'Too many subscribers') {
    super(message);
    this.name = 'TooManySubscribersError';
  }
}

export class TooFewEventsError extends Error {
  constructor(message = 'Too few events') {
    super(message);
    this.name = 'TooFewEventsError';
  }
}

export class TooManyEventsError extends Error {
  constructor(message = 'Too many events') {
    super(message);
    this.name = 'TooManyEventsError';
  }
}
