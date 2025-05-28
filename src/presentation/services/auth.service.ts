import { encryptedPlugin, envPlugin, jwtConfig } from "../../config";
import { UserModel } from "../../data";
import {
    CustomError,
    LoginUserDto,
    RegisterUserDto,
    UserEntity
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
    // DI
    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerDto.email });
        if (existUser) throw CustomError.badRequest(`Email ${registerDto.email} already exists`);

        try {
            const user = new UserModel(registerDto);

            // TODO: encrypt password
            user.password = encryptedPlugin.hash(registerDto.password);

            // TODO: Generate JWT
            const token = await jwtConfig.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServer("Failed to generate token");

            // TODO: Send email
            await this.sendEmailVerification(user.email)

            // TODO: Save user            
            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return {
                user: { ...userEntity },
                token: token, // TODO: JWT
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        // TODO: Validate user
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest(`User with email ${loginUserDto.email} not found`);

        // TODO: Compare password
        const isValidPassword = encryptedPlugin.compare({ hash: user.password, password: loginUserDto.password });
        if (!isValidPassword) throw CustomError.badRequest("Invalid password");

        // TODO: return data
        const { password, ...userEntity } = UserEntity.fromObject(user);

        // TODO: Generate JWT
        const token = await jwtConfig.generateToken({ id: user.id });
        if (!token) throw CustomError.internalServer("Failed to generate token");

        return {
            severity: "success",
            message: "User login successfully",
            data: {
                user: userEntity,
                token: token, // TODO: JWT
            },
        };

    }

    private sendEmailVerification = async (email: string) => {
        // TODO: generete verification token
        const token = await jwtConfig.generateToken({ email });
        if (!token) throw CustomError.internalServer("Failed to generate verification token");

        // TODO: create link
        const link = `${envPlugin.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const htmlBody = `
            <h1>Validate your email</h1>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <a href="${link}">Verify Email</a>
            <p>If you did not register, please ignore this email.</p>
        `;

        // TODO: send email
        const options = {
            to: email,
            subject: "Email Verification",
            htmlBody: htmlBody
        }

        const isEmailSent = await this.emailService.sendEmail(options);
        if (!isEmailSent) throw CustomError.internalServer("Failed to send verification email");
        return true;
    }

    /**
     * Validates a user's email address using a JWT token.
     * 
     * This method decodes the provided token, extracts the user's email,
     * retrieves the user from the database, and marks the email as validated.
     * 
     * @param {string} token - JWT token containing the user's email.
     * @returns {Promise<boolean>} - Returns `true` if the email was successfully validated.
     * 
     * @throws {CustomError} - Throws an error if:
     * - The token is invalid.
     * - The email is missing in the token payload.
     * - No user is found with the provided email.
     * - The email has already been validated.
     */
    public validateEmail = async (token: string) => {
        const payload = await jwtConfig.validateToken(token);
        if (!payload) throw CustomError.badRequest("Invalid token");

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer("Email not in token");

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.internalServer(`User with email ${email} not found`);
        if (user.emailValidated) throw CustomError.badRequest("Email already validated");

        user.emailValidated = true;
        await user.save();
        return true
    }
}