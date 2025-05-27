export class UpdateCategoryDto {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly available: boolean,
        public readonly description: string,
    ) { }

    static create(obj: { [key: string]: any }): [string?, UpdateCategoryDto?] {
        const { id, name, available = false, description } = obj;
        let availableBoolean = available

        if (!id) return ["ID is required"];
        if (!name) return ["Missing name"];
        if (typeof availableBoolean !== "boolean") {
            availableBoolean = (available.toLowerCase() === 'true' || available === '1') ? true : false;
        }

        if (!description) return ["Missing description"];

        return [undefined, new UpdateCategoryDto(id, name, availableBoolean, description)];

    }
}