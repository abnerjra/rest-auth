import { CategoryModel } from "../../data";
import { CategoryEntity, CreateCategoryDto, CustomError, UserEntity } from "../../domain";

export class CategoryService {
    // Dependency Injection (DI) can be added here if needed
    constructor() { }

    async getCategories() {
        const getCategories = await CategoryModel.find();
        const categories = getCategories.map(category => CategoryEntity.fromObject(category));
        return categories
    }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (categoryExists) throw CustomError.badRequest("Category already exists");

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save();
            return {
                id: category.id,
                name: category.name,
                available: category.available,
                description: category.description,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}