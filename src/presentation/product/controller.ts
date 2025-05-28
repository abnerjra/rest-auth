import { Request, Response } from "express";
import {
    CreateProductDto,
    CustomError,
    PaginationDto,
    ReadIDDto,
    UpdateProductDto
} from "../../domain";
import { ProductService } from '../services/product.service'

export class ProductController {
    // DI
    constructor(
        private readonly productService: ProductService
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

        this.productService.getProducts(paginationDto!)
            .then((product) => {
                res.status(200).json({
                    severity: 'success',
                    message: 'Get all products',
                    data: product
                })
                return
            })
            .catch((err) => this.handleError(err, res));
    }

    getById = (req: Request, res: Response) => {
        const productId = req.params.id;
        const [error, readProductDto] = ReadIDDto.create(productId);
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.productService.getProduct(readProductDto!)
            .then((product) => {
                res.status(200).json({
                    severity: "success",
                    message: "Product retrieved successfully",
                    data: product
                });
            })
            .catch((err) => this.handleError(err, res))
    }

    create = (req: Request, res: Response) => {
        const auth = (req as any).auth
        const [error, createProductDto] = CreateProductDto.create({ ...req.body, user: auth.id })
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.productService.createProduct(createProductDto!)
            .then((product) => {
                res.status(201).json({
                    severity: 'success',
                    message: 'Created product',
                    data: product
                })
                return
            })
            .catch((err) => this.handleError(err, res))
    }

    update = (req: Request, res: Response) => {
        const id = req.params.id;
        const auth = (req as any).auth
        const [error, updateProductDto] = UpdateProductDto.create({ ...req.body, user: auth.id, id })
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }
        this.productService.updateProduct(updateProductDto!)
            .then((product) => {
                res.status(200).json({
                    severity: "success",
                    message: "Product updated successfully",
                    data: product,
                });
            })
            .catch((err) => this.handleError(err, res));
    }

    delete = (req: Request, res: Response) => {
        const productId = req.params.id;
        const [error, readProductDto] = ReadIDDto.create(productId);
        if (error) {
            res.status(400).json({
                severity: "error",
                message: error,
            });
            return;
        }

        this.productService.deleteProduct(readProductDto!)
            .then((product) => {
                res.status(200).json({
                    severity: "success",
                    message: "Product deleted successfully",
                    data: product
                });
            })
            .catch((err) => this.handleError(err, res))
    }
}