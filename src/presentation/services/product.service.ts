import { ProductModel } from "../../data";
import {
    CreateProductDto,
    CustomError,
    PaginationDto,
    ReadIDDto,
    UpdateProductDto
} from "../../domain";

interface PaginationResponse {
    page: number;
    limit: number;
    totalPerPage: number;
    total: number;
    next: string | null;
    prev: string | null;
}

/**
 * Service class responsible for managing categories.
 * Handles operations like listing categories with pagination and creating new categories.
 */
export class ProductService {
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
     *   prev: string | null
     * }>} - An object containing paginated category data and navigation links.
     */
    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto
        const [totalProducts, products] = await Promise.all([
            ProductModel.countDocuments(),
            ProductModel.find()
                .skip((paginationDto.page - 1) * paginationDto.limit)
                .limit(paginationDto.limit)
                .populate('user', 'id name')
                .populate('category', 'id name')
        ]);

        return {
            page: page,
            limit: limit,
            totalPerPage: products.length,
            total: totalProducts,
            next: (page >= Math.ceil(totalProducts / limit)) ? null : `api/category?page=${(page + 1)}&limit=${limit}`,
            prev: (page - 1 > 0) ? `api/category?page=${(page - 1)}&limit=${limit}` : null,
            records: products,
        }
    }

    /**
     * Creates a new category if one with the same name doesn't already exist.
     *
     * @param {CreateProductDto} createProductDto - Data for creating a new category.
     * @returns {Promise<{
     *   id: string,
     *   name: string,
     *   available: boolean,
     *   description: string
     * }>} - Basic information about the newly created category.
     * @throws {CustomError} - If the category already exists or if a database error occurs.
     */
    async createProduct(createProductDto: CreateProductDto) {
        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if (productExists) throw CustomError.badRequest("Product already exists");

        try {
            const product = new ProductModel(createProductDto)

            await product.save();

            return product

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProduct(readProductDto: ReadIDDto) {
        const product = await ProductModel.findById(readProductDto.id)
            .populate([
                { path: 'user', select: 'name' },
                { path: 'category', select: 'name' }
            ])
        if (!product) throw CustomError.notFound("Product not found");
        return product;
    }

    async updateProduct(updateProductDto: UpdateProductDto) {
        const productExists = await ProductModel.findOne({
            name: updateProductDto.name,
            _id: { $ne: updateProductDto.id }
        })
        if (productExists) throw CustomError.badRequest("Product already exists");

        try {
            const product = await ProductModel.findByIdAndUpdate(
                updateProductDto.id,
                {
                    name: updateProductDto.name,
                    available: updateProductDto.available,
                    description: updateProductDto.description,
                    price: updateProductDto.price,
                    category: updateProductDto.category
                },
                { new: true }
            );
            if (!product) throw CustomError.notFound("Category not found");
            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteProduct(readProductDto: ReadIDDto) {
        const deletedProduct = await ProductModel.findByIdAndDelete(readProductDto.id);
        if (!deletedProduct) throw CustomError.notFound(`Product with ID ${readProductDto.id} not found`);
        return deletedProduct.id;
    }
}