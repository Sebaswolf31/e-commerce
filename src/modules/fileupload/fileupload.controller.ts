import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) {}

  @ApiBearerAuth()
  @Post('uploadImage/:productId')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: ' Archivo demasiado grande',
          }),

          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileuploadService.uploadProductImage(file, productId);
  }
}
