import winston, {format} from "winston";
import * as ENV from "../config/envConfig";

console.log("log level: " + ENV.LOG_LEVEL)

export const LOG = winston.createLogger({
    level: ENV.LOG_LEVEL,
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.timestamp({format: 'DD.MM.YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info =>{
            return `${info.level}: ${[info.timestamp]}: ${info.message}`;
        }),
    ),
});