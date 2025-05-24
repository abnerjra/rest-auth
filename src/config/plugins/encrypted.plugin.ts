import { compare, compareSync, genSaltSync, hashSync } from "bcryptjs";

export const encryptedPlugin = {
    hash: (password: string): string => {
        const salt = genSaltSync(12);
        return hashSync(password, salt);
    },
    compare: (password: string, hash: string): boolean => {
        return compareSync(password, hash)
    }
}