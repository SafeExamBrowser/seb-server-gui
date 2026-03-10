import winston, { format } from "winston";

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

export const logRequest = ({
  method,
  url,
  statusCode,
}: {
  method?: string;
  url: string;
  statusCode?: number;
}) => {
  logger.info(`${method ?? "?"} ${url} → ${statusCode ?? "?"}`);
};

export const logInfo = (message: string) => {
  logger.info(message);
};

export const logError = (prefix: string, message: string) => {
  logger.error(`[${prefix}] ${message}`);
};
