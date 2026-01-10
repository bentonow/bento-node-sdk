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

export class AuthorNotAuthorizedError extends Error {
  constructor(message = 'Author not authorized to send on this account') {
    super(message);
    this.name = 'AuthorNotAuthorizedError';
  }
}

export class RequestTimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'RequestTimeoutError';
  }
}
