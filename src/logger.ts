import { format as formatDate } from 'date-fns';
import * as winston from 'winston';

const { format } = winston;

const enumerateErrorFormat = format(info => {
  if ((info.message as any) instanceof Error) {
    info.message = Object.assign(
      {
        message: (info.message as any).message,
        stack: (info.message as any).stack,
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }

  return info;
});

const fileFormatter = format.combine(format.timestamp(), format.json());

const consoleFormatter = format.combine(
  format(info => {
    if (info.stack) {
      info.message = info.stack;
      delete info.stack;
    }
    return info;
  })(),
  format.colorize(),
  format.align(),
  format.simple()
);

const getTimestampedFileName = (str: string): string => {
  const name = str.slice(0, str.lastIndexOf('.'));
  const ext = str.slice(str.lastIndexOf('.'));

  const dt = formatDate(new Date(), 'yyyy-MM-dd');

  return `${name}_${dt}${ext}`;
};

const logger = winston.createLogger({
  exitOnError: false,
  format: enumerateErrorFormat(),
  transports: [
    new winston.transports.Console({
      format: consoleFormatter,
    }),
    new winston.transports.File({
      filename: getTimestampedFileName('combined.log'),
      dirname: 'logs',
      format: fileFormatter,
    }),
    new winston.transports.File({
      level: 'error',
      dirname: 'logs',
      filename: getTimestampedFileName('error.log'),
      format: fileFormatter,
    }),
  ],
});

export default logger;
