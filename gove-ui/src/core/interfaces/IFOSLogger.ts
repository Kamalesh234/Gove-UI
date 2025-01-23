// log-message.interface.ts

import { LogLevel } from "../common/fos-loglevel";

/**
 * Interface for a log message
 *
 * @template T - Type of the main content of the log message
 */
export interface LogMessage<T> {
    timestamp: string;  // Timestamp when the log message was created
    message: T;         // The main content of the log message
    level: LogLevel;    // The log level (e.g., LOG, DEBUG, WARNING, INFO, ERROR)
    optionalParams?: (string | number | boolean | object | null | undefined)[];  // Optional parameters for additional information
}
