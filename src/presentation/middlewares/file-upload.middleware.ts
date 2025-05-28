import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle basic file upload validation and normalization.
 *
 * This middleware checks if files were uploaded in the request,
 * and ensures that the uploaded files are accessible in a standardized array format
 * via `req.body.files`, regardless of whether a single file or multiple files were uploaded.
 */
export class FileUploadMiddleware {

    /**
     * Express middleware function to validate file uploads.
     *
     * - Checks if `req.files` exists and is not empty.
     * - Normalizes the uploaded files to always be an array in `req.body.files`.
     *
     * @param {Request} req - The Express request object, expecting files to be available under `req.files.file`.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - Callback to pass control to the next middleware.
     *
     * @returns {void}
     *
     * @throws {400} If no files were included in the request.
     */
    static execute(req: Request, res: Response, next: NextFunction) {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).json({
                severity: "error",
                message: 'No files were selected',
            });
            return;
        }

        // Ensure req.body is defined
        req.body = req.body || {};
        
        if (!Array.isArray(req.files.file)) {
            req.body.files = [req.files.file];
        } else {
            req.body.files = req.files.file;
        }

        next();
    }
}