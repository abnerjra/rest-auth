import path from 'path';
import { UploadedFile } from "express-fileupload"
import fs from 'fs';
import { Uuid } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {
    constructor(
        private readonly uuid = Uuid.generate
    ) { }

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'pneg', 'jpeg', 'gif']
    ) {
        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if (!validExtensions.includes(fileExtension)) throw CustomError.badRequest(`Invalid extension ${fileExtension}, valied ones ${validExtensions}`)

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`

            file.mv(`${destination}/${fileName}`)
            return fileName
        } catch (error) {
            // console.log(error)
            throw error
        }

    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'pneg', 'jpeg', 'gif']
    ) {
        const uploadFiles = await Promise.all(
            files.map(file => this.uploadSingle(file, folder, validExtensions))
        );

        return uploadFiles;
    }
}