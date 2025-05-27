import { NextFunction, Request, Response } from "express";
import { jwtConfig } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    static async validateToken(req: Request, res: Response, next: NextFunction) {

        const authorizationHeader = req.header('Authorization');
        if (!authorizationHeader) {
            res.status(401).json({ severity: 'error', message: 'No token provided' });
            return;
        }
        if (!authorizationHeader.startsWith('Bearer ')) {
            res.status(401).json({ severity: 'error', message: 'Invalid Bearer token' });
            return;
        }

        const token = authorizationHeader.split(' ').at(1) || '';
        try {
            const payload = await jwtConfig.validateToken<{ id: string }>(token);
            if (!payload) {
                res.status(401).json({ severity: 'error', message: 'Expired token' });
                return;
            }

            const user = await UserModel.findById(payload.id);
            if (!user) {
                res.status(401).json({ severity: 'error', message: 'Invalid token - user' });
                return;
            }

            if (!user.emailValidated) {
                res.status(401).json({ severity: 'error', message: 'User not active' });
                return;
            }

            const { password, ...userAuth } = UserEntity.fromObject(user);
            // req.body.auth = userAuth; // Attach user to the request body
            (req as any).auth = userAuth;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ severity: 'error', message: 'Internal server error' });
            return;
        }
    }

}