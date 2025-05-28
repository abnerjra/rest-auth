import { Router } from "express";
import { FileUploadController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { FileUploadService } from "../services/file-upload.service";

export class UploadRoutes {
    static get routes(): Router {
        const router = Router();

        const service = new FileUploadService()
        const controller = new FileUploadController(service);

        const middlewares = [
            AuthMiddleware.validateToken
        ];

        // Define your routes here
        router.post('/single/:type', middlewares, controller.uploadFile);
        router.post('/multiple/:type', middlewares, controller.uploadMultiPleFiles);

        return router;
    }
}