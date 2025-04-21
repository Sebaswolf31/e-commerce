import { Injectable } from '@nestjs/common';
import { Readable } from 'stream'; 
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class FileuploadRepository {
  async uploadProductImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`),
            );
          }
          resolve(result);
        },
      );

      if (!file || !file.buffer) {
        return reject(new Error('Invalid file input'));
      }

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(upload);
    });
  }
}
