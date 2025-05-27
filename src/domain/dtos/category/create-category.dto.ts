export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly description: string,
    ) { }

    static create(obj: { [key: string]: any }): [string?, CreateCategoryDto?] {
        const { name, available = false, description } = obj;
        let availableBoolean = available

        if (!name) return ["Missing name"];
        if (typeof availableBoolean !== "boolean") {
            availableBoolean = (available === true);
        }

        if (!description) return ["Missing description"];

        return [undefined, new CreateCategoryDto(name, availableBoolean, description)];

    }
}