export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
}
