import appLogger from './config/winston';

class Logger {
  private filename: string;

  public constructor(filename: string) {
    this.filename = filename;
  }

  public error(message: string) {
    appLogger.error(message, { filename: this.filename });
  }

  public warn(message: string) {
    appLogger.warn(message, { filename: this.filename });
  }

  public info(message: string) {
    appLogger.info(message, { filename: this.filename });
  }

  public verbose(message: string) {
    appLogger.verbose(message, { filename: this.filename });
  }

  public debug(message: string) {
    appLogger.debug(message, { filename: this.filename });
  }

  public silly(message: string) {
    appLogger.silly(message, { filename: this.filename });
  }

  public log(level: string, message: string) {
    appLogger.log(level, message, { filename: this.filename });
  }
}

export default Logger;
