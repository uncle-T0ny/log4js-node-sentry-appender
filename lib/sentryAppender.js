const log4js = require('log4js');
const Sentry = require('@sentry/node');

const levels = log4js.levels;

function sentryAppender(layout) {
  return (loggingEvent) => {
    const { level } = loggingEvent.level;
    if (levels.FATAL.level === level || levels.ERROR.level === level) {
      const [errorMessage, error] = loggingEvent.data;
      Sentry.captureException(error);
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
