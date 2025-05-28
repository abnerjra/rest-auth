import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
    // DI
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    uploadFile = (req: Request, res: Response) => {
        const type = req.params.type;
        const validTypes = ['user', 'product', 'category']
        if (!validTypes.includes(type)) {
            res.status(400).json({
                severity: 'error',
                message: `Invalid type ${type}, valied ones ${validTypes}`
            });
            return;
        }

        // const file = req.body.files.at(0) as UploadedFile;
        const file = req.body.files.at(0);
        const pathDestiny = `uploads/${type}`

        this.fileUploadService.uploadSingle(file, pathDestiny)
            .then((upload) => {
                res.status(200).json({
                    severity: "success",
                    message: 'File single upload',
                    data: upload
                });
                return;
            })
            .catch((error) => this.handleError(error, res))
    }

    uploadMultiPleFiles = (req: Request, res: Response) => {
        res.status(200).json({
            severity: "success",
            message: 'File multiple upload',
        });
        return;
    }
}