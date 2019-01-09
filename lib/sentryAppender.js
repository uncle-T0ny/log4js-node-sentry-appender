const log4js = require('log4js');
const Sentry = require('@sentry/node');

const levels = [
  log4js.levels.ERROR.level,
  log4js.levels.FATAL.level
];

function sentryAppender(config) {
  return (loggingEvent) => {
    const { level } = loggingEvent.level;

    // log only ERROR and FATAL
    if (!levels.includes(level)) {
      return;
    }

    let msg = loggingEvent.data[0];
    const params = [];

    // add prefix to log message
    if (config.prefix && typeof msg === 'string') {
      msg = `${config.prefix}${msg}`
    }

    // log exceptions
    loggingEvent.data.slice(1).forEach((arg) => {
      if (arg instanceof Error) {
        params.push(arg.toString());
      } else {
        params.push(arg);
      }
    });

    return Sentry.captureEvent({
      "sentry.interfaces.Message": {
        "message": msg,
        "params": params
      }
    });
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
