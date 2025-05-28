import { Router } from "express";
import { FileUploadController } from "./controller";
import { AuthMiddleware, FileUploadMiddleware } from "../middlewares";
import { FileUploadService } from "../services/file-upload.service";

export class UploadRoutes {
    static get routes(): Router {
        const router = Router();

        const service = new FileUploadService()
        const controller = new FileUploadController(service);

        const middlewares = [
            AuthMiddleware.validateToken,
            FileUploadMiddleware.execute
        ];

        router.use(middlewares)

        // Define your routes here
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultiPleFiles);

        return router;
    }
}