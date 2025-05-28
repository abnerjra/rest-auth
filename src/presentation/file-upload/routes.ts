import { Router } from "express";
import { FileUploadController } from "./controller";
import { AuthMiddleware } from "../middlewares";

export class UploadRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new FileUploadController();

        const middlewares = [
            AuthMiddleware.validateToken
        ];

        // Define your routes here
        router.post('/single/:type', middlewares, controller.uploadFile);
        router.post('/multiple/:type', middlewares, controller.uploadMultiPleFiles);

        return router;
    }
}