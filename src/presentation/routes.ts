import { Router } from "express";
import { Authroutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";
import { ProductRoutes } from "./product/routes";

export class AppRoutes {
    
    static get routes(): Router {
        const router = Router();
        const prefix = '/api';

        // Define your routes here
        router.use(`${prefix}/auth`, Authroutes.routes);
        router.use(`${prefix}/categories`, CategoryRoutes.routes);
        router.use(`${prefix}/products`, ProductRoutes.routes);

        return router;
    }
}