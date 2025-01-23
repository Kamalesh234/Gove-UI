/**
 * Error messages object for handling HTTP error translations.
 * Each key corresponds to an HTTP status code and its value is the corresponding error message.
 */
export const ERROR_MESSAGES = {
    UNKNOWN_ERROR: 'Unknown error occurred', // Default unknown error message
    BAD_REQUEST: 'Bad Request', // Error message for 400 Bad Request
    UNAUTHORIZED: 'Unauthorized', // Error message for 401 Unauthorized
    FORBIDDEN: 'Forbidden', // Error message for 403 Forbidden
    NOT_FOUND: 'Not Found', // Error message for 404 Not Found
    SERVER_ERROR: 'Server Error', // Error message for 500 Server Error
};
