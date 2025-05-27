import { CategoryModel } from "../../data";
import {
    CategoryEntity,
    CreateCategoryDto,
    CustomError,
    PaginationDto,
    UpdateCategoryDto,
    UserEntity
} from "../../domain";

interface PaginationResponse {
    page: number;
    limit: number;
    totalPerPage: number;
    total: number;
    next: string | null;
    prev: string | null;
    records: CategoryEntity[];
}

/**
 * Service class responsible for managing categories.
 * Handles operations like listing categories with pagination and creating new categories.
 */
export class CategoryService {
    // Dependency Injection (DI) can be added here if needed
    constructor() { }

    /**
     * Retrieves a paginated list of categories from the database.
     *
     * @param {PaginationDto} paginationDto - Pagination options including `page` and `limit`.
     * @returns {Promise<{
     *   page: number,
     *   limit: number,
     *   totalPerPage: number,
     *   total: number,
     *   next: string | null,
     *   prev: string | null,
     *   records: CategoryEntity[]
     * }>} - An object containing paginated category data and navigation links.
     */
    async getCategories(paginationDto: PaginationDto): Promise<PaginationResponse> {
        const { page, limit } = paginationDto
        const [totalCategories, getCategories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find()
                .skip((paginationDto.page - 1) * paginationDto.limit)
                .limit(paginationDto.limit),
        ]);

        const categories = getCategories.map(category => CategoryEntity.fromObject(category));
        return {
            page: page,
            limit: limit,
            totalPerPage: categories.length,
            total: totalCategories,
            next: (page >= Math.ceil(totalCategories / limit)) ? null : `api/category?page=${(page + 1)}&limit=${limit}`,
            prev: (page - 1 > 0) ? `api/category?page=${(page - 1)}&limit=${limit}` : null,
            records: categories,
        }
    }

    /**
     * Creates a new category if one with the same name doesn't already exist.
     *
     * @param {CreateCategoryDto} createCategoryDto - Data for creating a new category.
     * @param {UserEntity} user - The user who is creating the category.
     * @returns {Promise<{
     *   id: string,
     *   name: string,
     *   available: boolean,
     *   description: string
     * }>} - Basic information about the newly created category.
     * @throws {CustomError} - If the category already exists or if a database error occurs.
     */
    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<CategoryEntity> {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (categoryExists) throw CustomError.badRequest("Category already exists");

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save();
            return CategoryEntity.fromObject(category);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Retrieves a single category by its ID.
     *
     * @param {string} id - The ID of the category to retrieve.
     * @returns {Promise<CategoryEntity>} - The category entity corresponding to the given ID.
     * @throws {CustomError} - If no category is found with the provided ID.
     */
    async getCategory(id: string): Promise<CategoryEntity> {
        const category = await CategoryModel.findById(id);
        if (!category) throw CustomError.notFound("Category not found");
        return CategoryEntity.fromObject(category);
    }

    /**
     * Updates an existing category by ID with new data.
     *
     * Ensures that the new category name is unique (excluding the current category being updated).
     *
     * @param {UpdateCategoryDto} updateCategoryDto - The updated category data including ID.
     * @returns {Promise<CategoryEntity>} - The updated category entity.
     * @throws {CustomError} - If the category name already exists, or the category is not found, or a database error occurs.
     */
    async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
        const categoryExists = await CategoryModel.findOne({
            name: updateCategoryDto.name,
            _id: { $ne: updateCategoryDto.id } // Ensure we don't match the current category being updated
        });
        // console.log(categoryExists);
        if (categoryExists) throw CustomError.badRequest("Category already exists");

        try {
            const category = await CategoryModel.findByIdAndUpdate(
                updateCategoryDto.id,
                {
                    name: updateCategoryDto.name,
                    available: updateCategoryDto.available,
                    description: updateCategoryDto.description,
                },
                { new: true }
            );
            if (!category) throw CustomError.notFound("Category not found");
            return CategoryEntity.fromObject(category);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    /**
     * Deletes a category by its ID.
     *
     * @param {string} id - The ID of the category to delete.
     * @returns {Promise<string>} - The ID of the deleted category.
     * @throws {CustomError} - If the category is not found.
     */
    async deleteCategory(id: string): Promise<string> {
        const deletedCategory = await CategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) throw CustomError.notFound(`Category with ID ${id} not found`);
        return deletedCategory.id;
    }
}