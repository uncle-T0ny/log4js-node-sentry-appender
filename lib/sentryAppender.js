const log4js = require('log4js');
const Sentry = require('@sentry/node');

const levels = log4js.levels;

function sentryAppender(config) {
  return (loggingEvent) => {
    const { level, levelStr } = loggingEvent.level;
    if (levels.FATAL.level === level || levels.ERROR.level === level) {
      let [logMessage, logData] = loggingEvent.data;

      // add prefix to log message
      if (config.prefix) {
        logMessage = `${config.prefix}${logMessage}`
      }

      // capture error
      if (logData instanceof Error) {
        return Sentry.captureException(logData);
      }

      // message with params: "This is param1: %s"
      if (logData) {
        const messageParams = loggingEvent.data.slice(1);
        return Sentry.captureEvent({
          "sentry.interfaces.Message": {
            "message": logMessage,
            "params": [
              messageParams
            ]
          }
        })
      }

      // just a message
      if (logMessage) {
        return Sentry.captureMessage(logMessage, levelStr);
      }
    }
  };
}

function configure(config, layouts) {
  if (!config.dsn) {
    throw new Error('Sentry appender requires dsn property in config.');
  }

  Sentry.init({ dsn: config.dsn, environment: config.env });

  return sentryAppender(config);
}

exports.appender = sentryAppender;
exports.configure = configure;
