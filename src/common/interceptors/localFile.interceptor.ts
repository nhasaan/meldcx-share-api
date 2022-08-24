import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { editFileName, fileFilter } from '../utils/file.utils';

interface LocalFileInterceptorOptions {
  fieldName: string;
  path?: string;
}

function LocalFileInterceptor(
  options: LocalFileInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      // const maxFileCount = 5;
      const maxFileSize = configService.get('MAX_FILE_SIZE') * 1024 * 1024;
      const filesDestination = configService.get('FOLDER');
      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        limits: { fileSize: maxFileSize },
        storage: diskStorage({
          destination,
          filename: editFileName,
        }),
        fileFilter,
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFileInterceptor;
