import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './services/file.service';
import LocalFileInterceptor from '../common/interceptors/localFile.interceptor';
import { CommandResponse } from '../common/dto/command-response.dto';
import { UploadResponse } from './dto/upload-response.dto';
import { FetchFile } from './dto/fetch-file.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private fileService: FileService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'file',
      path: '/images',
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ): Promise<CommandResponse<UploadResponse>> {
    return this.fileService.uploadFile(file, user);
  }

  @Get(':uuId')
  async fetchFile(
    @Param('uuId') fileKey: string,
  ): Promise<CommandResponse<FetchFile>> {
    return await this.fileService.fetchFile(fileKey);
  }
}
