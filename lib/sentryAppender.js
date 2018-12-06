const log4js = require('log4js');
const Sentry = require('@sentry/node');

const levels = log4js.levels;

function sentryAppender(layout) {
  return (loggingEvent) => {
    const { level, levelStr } = loggingEvent.level;
    if (levels.FATAL.level === level || levels.ERROR.level === level) {
      const [logMessage, logData] = loggingEvent.data;
      if (logData instanceof Error) {
        Sentry.captureException(logData);
      } else if (logData) {
        const messageParams = loggingEvent.data.slice(1);
        // message exampele: "This is param1: %s"
        Sentry.captureEvent({
          "sentry.interfaces.Message": {
            "message": logMessage,
            "params": [
              messageParams
            ]
          }
        })
      } else if (logMessage) {
        Sentry.captureMessage(logMessage, levelStr);
      }

      if (logData) {
        Sentry.captureException(logData);
      } else if (logMessage) {
        Sentry.captureMessage(logMessage, levelStr)
      }
    }
  };
}

function configure(config, layouts) {
  let layout = layouts.colouredLayout;

  if (!config.dns) {
    throw new Error('Sentry appender requires dns property in config.');
  }

  Sentry.init({ dsn: config.dns, environment: config.env });

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  return sentryAppender(layout);
}

exports.appender = sentryAppender;
exports.configure = configure;
