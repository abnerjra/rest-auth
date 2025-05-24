import { encryptedPlugin, jwtConfig } from "../../config";
import { UserModel } from "../../data";
import {
    CustomError,
    LoginUserDto,
    RegisterUserDto,
    UserEntity
} from "../../domain";

export class AuthService {
    // DI
    constructor() { }

    public async registerUser(registerDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerDto.email });
        if (existUser) throw CustomError.badRequest(`Email ${registerDto.email} already exists`);

        try {
            const user = new UserModel(registerDto);

            // TODO: encrypt password
            user.password = encryptedPlugin.hash(registerDto.password);

            // TODO: Generate JWT

            // TODO: Send email

            // TODO: Save user            
            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return {
                user: { ...userEntity },
                token: "", // TODO: JWT
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
        const token = await jwtConfig.generateToken({ id: user.id, email: user.email });
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
}