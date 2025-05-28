import { Request, Response } from "express";
import { CustomError } from "../../domain";

import fs from 'fs';
import path from 'path';

export class ImageController {

    constructor() { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    getImage = (req: Request, res: Response) => {
        const { type = '', fileName = '' } = req.params;

        const pathFile = path.resolve(__dirname, `../../../uploads/${type}/${fileName}`)
        if (!fs.existsSync(pathFile)) {
            res.status(400).json({ severity: 'error', message: 'Image not found' })
        }

        res.sendFile(pathFile)
    }
}