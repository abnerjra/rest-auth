import { Router } from "express";
import { Authroutes } from "./auth/routes";

export class AppRoutes {
    
    static get routes(): Router {
        const router = Router();
        const prefix = '/api';

        // Define your routes here
        router.use(`${prefix}/auth`, Authroutes.routes);
        

        return router;
    }
}