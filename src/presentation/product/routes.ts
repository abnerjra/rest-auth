import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares";

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new ProductController()

        const middlewares = [AuthMiddleware.validateToken]

        router.get('/', middlewares, controller.getAll);
        router.get('/:id', middlewares, controller.getById);
        router.post('/', middlewares, controller.create);
        router.put('/:id', middlewares, controller.update);
        router.delete('/:id', middlewares, controller.delete);

        return router;
    }
}