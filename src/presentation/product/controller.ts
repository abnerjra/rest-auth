import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";

export class ProductController {
    // DI
    constructor(
        // TODO: private readonly productService: ProductService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ severity: "error", message: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ severity: "error", message: "Internal server error" });
    }

    getAll = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit)
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        res.status(200).json({
            severity: 'success',
            message: 'Get all products'
        })
        return
    }

    getById = (req: Request, res: Response) => {
        res.status(200).json({
            severity: 'success',
            message: 'Get By Id product'
        })
        return
    }

    create = (req: Request, res: Response) => {
        res.status(201).json({
            severity: 'success',
            message: 'Created product'
        })
        return
    }

    update = (req: Request, res: Response) => {
        res.status(200).json({
            severity: 'success',
            message: 'Updated product'
        })
        return
    }

    delete = (req: Request, res: Response) => {
        res.status(200).json({
            severity: 'success',
            message: 'Deleted product'
        })
        return
    }
}