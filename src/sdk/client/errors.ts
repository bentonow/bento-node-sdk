export class NotAuthorizedError extends Error {
  constructor(message = 'Not authorized') {
    super(message);
    this.name = 'NotAuthorizedError';
  }
}

export class RateLimitedError extends Error {
  constructor(message = 'You are being rate limited') {
    super(message);
    this.name = 'RateLimitedError';
  }
}
