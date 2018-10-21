## Sentry log4js appender

An example of the config:
```javascript
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    'log4js-node-sentry-appender': {  type: 'log4js-node-sentry-appender', dns: 'https://{KEYS}@{HOST}/{PROJECT_ID}' }
  },
  categories: {
    default: { appenders: ['console', 'log4js-node-sentry-appender'], level: 'error' }
  }
});
```
