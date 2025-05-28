import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { ImageController } from './controller';
export class ImageRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new ImageController()
        
        const middlewares = [
            AuthMiddleware.validateToken
        ];

        router.use(middlewares);
        
        router.get('/:type/:fileName', controller.getImage);


        return router;
    }
}