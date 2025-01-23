import { Injectable } from '@angular/core';
import { LogLevel } from '../../../core/common/fos-loglevel';
import { LogMessage } from '../../../core/interfaces/IFOSLogger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  // Logs a message to the log message with a timestamp
  public log<T>(message: T, optionalParams?: any[]): void {
    this.addToLog(this.createLogMessage(message, LogLevel.Log, optionalParams));
  }

  // Logs a debug message to the log message with a timestamp
  public debug<T>(message: T, optionalParams?: any[]): void {
    this.addToLog(this.createLogMessage(message, LogLevel.Debug, optionalParams));
  }

  // Logs a warning message to the log message with a timestamp
  public warning<T>(message: T, optionalParams?: any[]): void {
    this.addToLog(this.createLogMessage(message, LogLevel.Warning, optionalParams));
  }

  // Logs an info message to the log message with a timestamp
  public info<T>(message: T, optionalParams?: any[]): void {
    this.addToLog(this.createLogMessage(message, LogLevel.Info, optionalParams));
  }

  // Logs an error message to the log message with a timestamp
  public error<T>(message: T, optionalParams?: any[]): void {
    this.addToLog(this.createLogMessage(message, LogLevel.Error, optionalParams));
  }

  // Private method to create a log message with timestamp and log level
  private createLogMessage<T>(message: T, level: LogLevel, optionalParams?: any[]): LogMessage<T> {
    return {
      timestamp: this.getTimestamp(),
      message: message,
      level: level,
      optionalParams: optionalParams
    };
  }

  // Private method to get current timestamp in ISO format
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  // Here you can handle the log message as you wish, for example, storing it in an array
  private addToLog<T>(logMessage: LogMessage<T>): void {
    // Implement your logic to handle the log message here
    console.log(logMessage);
  }
}
