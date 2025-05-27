import { Router } from "express";
import { Authroutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";

export class AppRoutes {
    
    static get routes(): Router {
        const router = Router();
        const prefix = '/api';

        // Define your routes here
        router.use(`${prefix}/auth`, Authroutes.routes);
        router.use(`${prefix}/category`, CategoryRoutes.routes);
        

        return router;
    }
}