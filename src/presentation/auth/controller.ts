import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from "../services/auth.service";

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
            return;
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
        const [error, loginDto] = LoginUserDto.create(req.body);
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.authService.loginUser(loginDto!)
            .then((user) => {
                res.status(200).json({
                    severity: "success",
                    message: "User login successfully",
                    data: user,
                });
            })
            .catch((err) => this.handleError(err, res));
    }

    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params;
        this.authService.validateEmail(token)
            .then(() => {
                res.status(200).json({
                    severity: "success",
                    message: "User validate email successfully",
                    data: null
                });
            })
            .catch((err) => this.handleError(err, res));
    }
}