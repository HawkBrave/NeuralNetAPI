import { Request, Response, NextFunction } from "express";

// TODO: use this class to route errors
export class ErrorHandler {
  handleUnsupportedMediaType(err: Error, request: Request, response: Response, next: NextFunction) {
    response.status(415).send();
  }

  handleNotImplemented(err: Error, request: Request, response: Response, next: NextFunction) {
    response.status(501).send();
  }

  handleMethodNotAllowed(err: Error, request: Request, response: Response, next: NextFunction) {
    response.status(405).send();
  }
}