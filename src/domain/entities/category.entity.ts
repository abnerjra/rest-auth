import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly available: boolean,
        public readonly description: string,
        public readonly user: string,
        public readonly img?: string,
    ) {}

    static fromObject(obj: { [key: string]: any }): CategoryEntity {
        const { id, _id, name, available, description, user, img } = obj;

        if (!id && !_id) throw CustomError.badRequest("Missing ID");
        if (!name) throw CustomError.badRequest("Missing name");
        if (available === undefined) throw CustomError.badRequest("Missing availability status");
        if (!description) throw CustomError.badRequest("Missing description");
        if (!user) throw CustomError.badRequest("Missing user");

        return new CategoryEntity(
            id || _id,
            name,
            available,
            description,
            user,
            img
        );
    }
}