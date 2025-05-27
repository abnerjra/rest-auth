import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();

        const service = new CategoryService();
        const controller = new CategoryController(service);

        const middlewares = [AuthMiddleware.validateToken];

        // Define your routes here
        router.get('/', middlewares, controller.getCategories);
        router.get('/:id', middlewares, controller.getCategory);
        router.post('/', middlewares, controller.createCategory);
        router.put('/:id', middlewares, controller.updateCategory);
        router.delete('/:id', middlewares, controller.deleteCategory);

        return router;
    }
}