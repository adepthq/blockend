import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/** Log levels */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';

  return isDevelopment ? 'debug' : 'warn';
};

/** Log Colors output on cli */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

/** Log Format */
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms ' }),
  winston.format.colorize({ all: true }),
  winston.format.prettyPrint(),
  winston.format.printf(info => `${info.timestamp} ${info.level} ${info.message}`)
);

const transport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

/** Log Transport */
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  transport,
];

/** Main Logger */
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
