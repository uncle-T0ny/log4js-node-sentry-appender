## Sentry log4js appender

This package requires @sentry/node

An example of the config:
```javascript
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    simpleAppender: {  type: 'simpleAppender', dns: 'https://{KEYS}@{HOST}/{PROJECT_ID}' }
  },
  categories: {
    default: { appenders: ['simpleAppender'], level: 'error' }
  }
});
```