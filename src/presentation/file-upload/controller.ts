import { Request, Response } from "express";
import { CustomError } from "../../domain";

export class FileUploadController {
    // DI
    constructor(
        // private readonly categoryService: CategoryService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    uploadFile = (req: Request, res: Response) => {
        res.status(200).json({
            severity: "success",
            message: 'File single upload',
        });
        return;
    }

    uploadMultiPleFiles = (req: Request, res: Response) => {
        res.status(200).json({
            severity: "success",
            message: 'File multiple upload',
        });
        return;
    }
}