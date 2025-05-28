import { Validators } from "../../../config";

export class ReadIDDto {
    private constructor(
        public readonly id: string
    ) { }

    static create(id: string): [string?, ReadIDDto?] {
        if (!Validators.isMongoID(id)) return ['Invalid Product ID']

        return [undefined, new ReadIDDto(id)]
    }
}