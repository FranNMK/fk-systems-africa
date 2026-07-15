/* 
 * src/services/logger.js - Core structured logging service.
 * Uses Pino to output JSON logs. Redacts sensitive fields.
 * Exports a base logger and a helper to attach child loggers for correlation IDs.
 */

const pino = require('pino');

// Configuration for the base logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
  formatters: {
    level: (label) => { return { level: label }; },
  },
  // Automatically redact sensitive fields from logged objects
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'req.body.token', 'password', 'token'],
    censor: '***REDACTED***'
  },
  timestamp: pino.stdTimeFunctions.isoTime, // ISO timestamps for easy sorting
  base: {
    service: 'fk-systems-africa-api'
  }
});

module.exports = logger;