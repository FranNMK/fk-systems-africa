/* 
 * src/middleware/requestLogger.js - Request lifecycle logger.
 * Adds a correlation ID to every request, attaches a child logger to req,
 * and logs the start and end of every HTTP transaction.
 */

const crypto = require('crypto');
const logger = require('../services/logger');

function requestLogger(req, res, next) {
  // 1. Generate or extract correlation ID (e.g., from x-correlation-id header)
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  req.correlationId = correlationId;

  // 2. Attach a child logger to the request object. 
  // Any log called via req.log will automatically include this correlationId.
  req.log = logger.child({ correlationId: correlationId });

  // 3. Log the start of the request
  const startTime = Date.now();
  req.log.info({
    event: 'request.start',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }, 'Request started');

  // 4. Log the end of the request (when response finishes)
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    req.log.info({
      event: 'request.end',
      statusCode: res.statusCode,
      durationMs: duration,
      contentLength: res.get('content-length') || 0
    }, 'Request completed');
  });

  // 5. Catch errors and log them centrally (Express will catch these naturally)
  next();
}

module.exports = requestLogger;