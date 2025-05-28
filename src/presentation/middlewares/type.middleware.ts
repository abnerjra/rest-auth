import { NextFunction, Request, Response } from "express";

/**
 * Middleware to validate resource type from the request URL.
 *
 * This middleware inspects the second segment of the URL path
 * (e.g., `/api/uploads/:type/filename.jpg`) and checks whether
 * it belongs to a predefined list of valid types.
 */
export class TypeMiddleware {
    /**
     * Returns a middleware function that validates the type in the URL.
     *
     * @param {string[]} validTypes - List of allowed type values to validate against.
     * @returns {(req: Request, res: Response, next: NextFunction) => void} - Middleware function.
     *
     * Example: For a URL `/api/uploads/users/file.png`, it will extract `users`
     * as the type and check if it exists in `validTypes`.
     */
    static execute(validTypes: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const type = req.url.split('/').at(2) ?? '';
            console.log({ type })
            if (!validTypes.includes(type)) {
                res.status(400).json({
                    severity: 'error',
                    message: `Invalid type ${type}, valied ones ${validTypes}`
                });
                return;
            }
            next();
        }
    }
}