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

export class TooFewEmailsError extends Error {
  constructor(message = 'Too few emails') {
    super(message);
    this.name = 'TooFewEmailsError';
  }
}

export class TooManyEmailsError extends Error {
  constructor(message = 'Too many emails') {
    super(message);
    this.name = 'TooManyEmailsError';
  }
}
