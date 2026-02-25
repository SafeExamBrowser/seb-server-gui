import winston, { format } from "winston";
import { IncomingMessage } from "http";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf((info) => {
      return `[${info.timestamp}] ${info.level} ${info.message}`;
    }),
  ),
});

export const logRequest = (req: IncomingMessage, statusCode?: number) => {
  logger.info(`${req.method} ${req.url} → ${statusCode ?? "?"}`);
};

export const logInfo = (message: string) => {
  logger.info(message);
};

export const logError = (prefix: string, message: string) => {
  logger.error(`[${prefix}] ${message}`);
};
