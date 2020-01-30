import fs from 'fs';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import httpContext from 'express-http-context';

const { colorize, combine, metadata, timestamp, printf } = format;

const logConsole = process.env.LOG_CONSOLE || 'false;';
const logLevel = process.env.LOG_LEVEL || 'info';
const logDir = process.env.LOG_DIR || 'logs';
const logFilename = process.env.LOG_FILE_NAME || 'app.log';
const accessLogFilename = process.env.ACCESS_LOG_FILE_NAME || 'access.log';
const logMaxSize = process.env.LOG_MAX_SIZE || '100m';
const logRetentionPeriod = process.env.LOG_RETENTION_PERIOD || '7d';

/**
 * this customFormat will format the text and color only ERROR message to red
 */
const customFormat = printf(info => {
  const transactionID = httpContext.get('transactionID');
  const transactionIDBlock = transactionID ? `[${transactionID}]` : '';
  const message = `${info.timestamp} [${info.metadata.filename}] ${info.level} ${transactionIDBlock}\t${info.message}`;

  if (info.level === 'ERROR' || info.level === 'WARN') {
    return colorize({ level: true }).colorize(info.level.toLowerCase(), message);
  }

  return message;
});

const customAccessLogFormat = printf(info => {
  return `${info.message}`;
});

const changeLevelToUpperCase = format(info => {
  info.level = info.level.toUpperCase();

  return info;
});

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const appLogger = createLogger({
  level: logLevel,
  exitOnError: false,
  format: combine(
    changeLevelToUpperCase(),
    metadata(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    customFormat
  ),
  transports: [
    new DailyRotateFile({
      dirname: logDir,
      filename: logFilename,
      datePattern: 'YYYYMMDD',
      maxSize: logMaxSize,
      maxFiles: logRetentionPeriod,
      zippedArchive: true
    })
  ]
});

const accessLogger = createLogger({
  exitOnError: false,
  format: customAccessLogFormat,
  transports: [
    new DailyRotateFile({
      dirname: logDir,
      filename: accessLogFilename,
      datePattern: 'YYYYMMDD',
      maxSize: logMaxSize,
      maxFiles: logRetentionPeriod,
      zippedArchive: true
    })
  ]
});

if (logConsole) {
  appLogger.add(new transports.Console());
}

export default appLogger;
export class AccessLogStream {
  public write(message: string) {
    accessLogger.log(process.env.ACCESS_LOG_LEVEL, message);
  }
}
