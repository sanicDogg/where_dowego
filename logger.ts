import * as log from '@std/log';
import { Logger } from '@std/log/get-logger';

log.setup({
  handlers: {
    console: new log.ConsoleHandler('DEBUG', {
      formatter: (record) => `${record.levelName} ${record.datetime} ${record.msg}`,
    }),

    file: new log.FileHandler('WARN', {
      filename: './log.txt',
      // you can change format of output message using any keys in `LogRecord`.
      formatter: (record) => `${record.levelName} ${record.datetime} ${record.msg}`,
    }),
  },

  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: 'DEBUG',
      handlers: ['console', 'file'],
    },

    tasks: {
      level: 'ERROR',
      handlers: ['console'],
    },
  },
});

let logger: Logger;

// get default logger.
logger = log.getLogger();

export { logger };
