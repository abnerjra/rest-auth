import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";
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
                res.status(201).json({
                    severity: "success",
                    message: "Category created successfully",
                    data: category,
                });
            })
            .catch((err) => this.handleError(err, res));

    }

    getCategories = (req: Request, res: Response) => {
        this.categoryService.getCategories()
            .then((categories) => {
                res.status(200).json({
                    severity: "success",
                    message: "Categories retrieved successfully",
                    data: categories,
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