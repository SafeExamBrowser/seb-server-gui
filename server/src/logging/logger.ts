import winston, {format} from "winston";

export const LOG = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.timestamp({format: 'DD.MM.YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info =>{
            return `${info.level}: ${[info.timestamp]}: ${info.message}`;
        }),
    ),
});