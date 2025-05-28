import { Validators } from "../../../config";

export class UpdateProductDto {

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly available: string,
        public readonly description: string,
        public readonly price: number,
        public readonly user: string,
        public readonly category: string
    ) { }

    static create(obj: { [key: string]: any }): [string?, UpdateProductDto?] {
        const {
            id,
            name,
            available,
            description,
            price,
            user,
            category
        } = obj

        let availableBoolean = available

        if (!Validators.isMongoID(id)) return ['Invalid Product ID']

        if (!name) return ['Miising name']
        if (typeof availableBoolean !== "boolean") {
            availableBoolean = (available.toLowerCase() === 'true' || available === '1') ? true : false;
        }
        if (!description) return ['Miising description']
        if (!price) return ['Miising price']
        if (!user) return ['Miising user']
        if (!Validators.isMongoID(user)) return ['Invalid User ID']
        if (!category) return ['Miising category']
        if (!Validators.isMongoID(category)) return ['Invalid Category ID']

        return [
            undefined,
            new UpdateProductDto(
                id,
                name,
                availableBoolean,
                description,
                price,
                user,
                category
            )
        ]
    }
}