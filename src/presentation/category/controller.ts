import { Request, Response } from "express";
import {
    CreateCategoryDto,
    CustomError,
    PaginationDto
} from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    // DI
    constructor(
        private readonly categoryService: CategoryService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.categoryService.createCategory(createCategoryDto!, req.body.auth)
            .then((category) => {
                const { id, name, available, description } = category;
                res.status(201).json({
                    severity: "success",
                    message: "Category created successfully",
                    data: {
                        id,
                        name,
                        available,
                        description,
                    },
                });
            })
            .catch((err) => this.handleError(err, res));

    }

    getCategories = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit)
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.categoryService.getCategories(paginationDto!)
            .then((categories) => {
                const { page, limit, totalPerPage, total, next, prev, records } = categories;
                res.status(200).json({
                    severity: "success",
                    message: "Categories retrieved successfully",
                    data: records,
                    pagination: {
                        page,
                        limit,
                        totalPerPage,
                        total,
                        next: next ? `api/category?${next}` : null,
                        prev: prev ? `api/category?${prev}` : null,
                    },
                });
            })
            .catch((err) => this.handleError(err, res));
    }

    getCategory = async (req: Request, res: Response) => {
        // TODO: Logic to be implemented soon
    }

    updateCategory = async (req: Request, res: Response) => {
        // TODO: Logic to be implemented soon
    }

    deleteCategory = async (req: Request, res: Response) => {
        // TODO: Logic to be implemented soon
    }
}