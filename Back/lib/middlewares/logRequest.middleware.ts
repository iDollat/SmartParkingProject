import {Request, Response, NextFunction, RequestHandler} from 'express';

const logRequest: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    console.log(`[${request.method} ${request.url} ${new Date().toISOString()}]`);
    next();
}

export default logRequest;
