import jwt, { SignOptions } from "jsonwebtoken";
import { envPlugin } from "./env.plugin";

const JWT_SECRET = envPlugin.JWT_SECRET;

export class jwtConfig {

    static async generateToken(payload: any, duration: SignOptions["expiresIn"] = '1h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {

                if (err) return resolve(null);

                resolve(token)

            });
        })
    }

    static validateToken(token: string) {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded);
            })
        })
    }
}