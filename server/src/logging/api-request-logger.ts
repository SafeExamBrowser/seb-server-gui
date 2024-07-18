import morgan from "morgan";
import {LOG} from "./logger";

export const apiRequestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        write: (message) => LOG.info(message.trim()),
      },
    }
  );