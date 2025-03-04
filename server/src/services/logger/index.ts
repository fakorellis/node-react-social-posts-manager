import pino from 'pino'
import { LogLevel } from '../../core/enums'

/**
 * Logger class using Pino for structured logging.
 */
class Logger {
  private static logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  })

  /**
   * Logs a message with structured metadata.
   * @param level Log level (info, warn, error, debug)
   * @param message Log message
   * @param code Custom error code
   * @param status HTTP status code
   */
  public static log(level: LogLevel, message: string, code?: string, status?: number): void {
    const logObject: Record<string, any> = { message }

    if (code) logObject.code = code
    if (status) logObject.status = status

    switch (level) {
      case LogLevel.INFO:
        this.logger.info(logObject);
        break;
      case LogLevel.WARN:
        this.logger.warn(logObject);
        break;
      case LogLevel.ERROR:
        this.logger.error(logObject);
        break;
      case LogLevel.DEBUG:
        this.logger.debug(logObject);
        break;
      default:
        this.logger.info(logObject);
    }
  }
}

export default Logger
