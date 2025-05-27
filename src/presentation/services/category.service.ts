import { CategoryModel } from "../../data";
import {
    CategoryEntity,
    CreateCategoryDto,
    CustomError,
    PaginationDto,
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
}