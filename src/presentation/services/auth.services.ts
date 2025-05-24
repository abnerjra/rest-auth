import { encryptedPlugin } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

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
                user: {...userEntity},
                token: "", // TODO: JWT
            };
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}