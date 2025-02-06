class ApplicationException {
    public error: string;
    public message: string;

    constructor(error: string, message: string) {
        this.error = error;
        this.message = message;
    }
}

const ErrorCodes = {
    BAD_REQUEST: { message: 'BAD_REQUEST', code: 400 },
    NOT_FOUND: { message: 'NOT_FOUND', code: 404 },
    FORBIDDEN: { message: 'FORBIDDEN', code: 403 },
    UNAUTHORIZED: { message: 'UNAUTHORIZED', code: 401 },
    VALIDATION_FAILURE: { message: 'VALIDATION_FAILURE', code: 406 },
    METHOD_NOT_ALLOWED: { message: 'METHOD_NOT_ALLOWED', code: 405 },
    PRECONDITION_FAILED: { message: 'PRECONDITION_FAILED', code: 412 },
    CONFLICT: { message: 'CONFLICT', code: 409 },
};

const ApplicationErrors = {
    is: function (error: ApplicationException, errorCode?: string): boolean {
        return error instanceof ApplicationException && (errorCode === undefined || error.error === errorCode);
    },
    new: function (code: number, message: string): ApplicationException {
        return new ApplicationException(code.toString(), message);
    },
    errorHandler: function (error: ApplicationException, response: any): void {
        if (error instanceof ApplicationException) {
            // @ts-ignore
            response.status(parseInt(error.error)).send(error.message || error.error.message);
        } else {
            // @ts-ignore
            console.error(error && error.stack || error);
            response.sendStatus(500);
        }
    }
};

export { ApplicationException, ErrorCodes, ApplicationErrors };
