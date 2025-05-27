export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: string,
        public readonly description: string,
        public readonly price: number,
        public readonly user: string,
        public readonly category: string
    ) { }

    static create(obj: { [key: string]: any }): [string?, CreateProductDto?] {
        const {
            name,
            available,
            description,
            price,
            user,
            category
        } = obj

        let availableBoolean = available

        if (!name) return ['Miising name']
        if (typeof availableBoolean !== "boolean") {
            availableBoolean = (available === true);
        }
        if (!description) return ['Miising description']
        if (!price) return ['Miising price']
        if (!user) return ['Miising user']
        if (!category) return ['Miising category']

        return [
            undefined,
            new CreateProductDto(
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