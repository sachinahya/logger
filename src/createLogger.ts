import * as winston from 'winston';
import {
  consoleFormatter,
  enumerateErrorFormat,
  fileFormatter,
  getTimestampedFileName,
} from './format';

interface LoggerOptions {
  /**
   * Directory to store log files.
   *
   * @default 'logs'
   */
  directory?: string;

  /**
   * Filename of the log file.
   *
   * @default 'combined.log'
   */
  filename?: string;

  /**
   * Minimum severity of messages to be logged.
   *
   * @default 'warn'
   */

  level?: 'error' | 'warn' | 'info';

  /**
   * Whether the log files are suffixed with the current date.
   *
   * @default true
   */
  splitByDay?: boolean;
}

/**
 * Creates a logger.
 *
 * @param options Options passed to the logger.
 * @returns A winston logger instance.
 */
const createLogger = ({
  directory = 'logs',
  filename = 'combined.log',
  level = 'warn',
  splitByDay = true,
}: LoggerOptions = {}): winston.Logger => {
  return winston.createLogger({
    exitOnError: false,
    format: enumerateErrorFormat(),
    transports: [
      new winston.transports.Console({
        format: consoleFormatter,
      }),
      new winston.transports.File({
        level,
        dirname: directory,
        filename: splitByDay ? getTimestampedFileName(filename) : filename,
        format: fileFormatter,
      }),
    ],
  });
};

export default createLogger;
