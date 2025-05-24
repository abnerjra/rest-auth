import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from "../services/auth.services";

export class AuthController {
    // DI
    constructor(
        public readonly authService: AuthService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
        }

        this.authService.registerUser(registerDto!)
            .then((user) => {
                res.status(200).json({
                    severity: "success",
                    message: "User registered successfully",
                    data: user,
                });
            })
            .catch((err) => this.handleError(err, res));
    }

    loginUser = (req: Request, res: Response) => {

        res.status(200).json({
            severity: "success",
            message: "User login successfully",
        });
    }

    validateEmail = (req: Request, res: Response) => {

        res.status(200).json({
            severity: "success",
            message: "User validate email successfully",
        });
    }
}