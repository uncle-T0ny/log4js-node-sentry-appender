const Sentry = require('@sentry/node');

function sentryAppender(layout) {
  return (loggingEvent) => {
    const [errorMessage, error] = loggingEvent.data;
    Sentry.captureException(error);
  };
}

function configure(config, layouts) {
  let layout = layouts.colouredLayout;

  if (!config.dns) {
    throw new Error('Sentry appender requires dns property in config.');
  }

  Sentry.init({ dsn: config.dns });

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  return sentryAppender(layout);
}

exports.appender = sentryAppender;
exports.configure = configure;
