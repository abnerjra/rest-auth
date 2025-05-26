import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envPlugin } from '../../config';
export class Authroutes {

    static get routes(): Router {

        const router = Router();

        // TODO: inyect dependencies EmailService
        const emailService = new EmailService(
            envPlugin.MAILER_SERVICE,
            envPlugin.MAILER_EMAIL,
            envPlugin.MAILER_SECRET_KEY
        )

        const authService = new AuthService(emailService);

        const controller = new AuthController(authService);

        // Definir las rutas
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.get('/validate-email/:token', controller.validateEmail);

        return router;
    }
}

