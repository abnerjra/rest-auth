import { Router } from "express";
import { ProductController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { ProductService } from "../services/product.service";

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();

        const service = new ProductService
        const controller = new ProductController(service)

        const middlewares = [AuthMiddleware.validateToken]

        router.get('/', middlewares, controller.getAll);
        router.get('/:id', middlewares, controller.getById);
        router.post('/', middlewares, controller.create);
        router.put('/:id', middlewares, controller.update);
        router.delete('/:id', middlewares, controller.delete);

        return router;
    }
}