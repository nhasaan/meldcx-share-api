import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../../storage/storage.service';
import { CommandResponse } from '../../common/dto/command-response.dto';
import { UploadResponse } from '../dto/upload-response.dto';
import { FetchFile } from '../dto/fetch-file.dto';
import { extname } from 'path';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '../../entities/file.entity';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, user: JwtPayload) {
    const response = new CommandResponse<UploadResponse>();
    // console.log(file);

    try {
      const fileData: UploadResponse = {
        ...new UploadResponse(),
        fileName: file.originalname,
        fileExt: extname(file.originalname),
        owner: user._id,
      };

      // save to database
      await this.fileModel.create(fileData);

      // upload it to GCP
      const metadata = [
        {
          description: 'file description...',
          modified: '1900-01-01',
        },
      ];
      await this.storageService.upload({
        fileKey: fileData.fileKey,
        media: file.buffer,
        contentType: file.mimetype,
        metadata,
      });
      response.data = fileData;

      return response;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  async fetchFile(fileKey: string): Promise<CommandResponse<FetchFile>> {
    const response = new CommandResponse<FetchFile>();
    try {
      // TODO -
      // Fetch the file from GCS using the uuid
      const file = await this.storageService.getFile(fileKey);
      const fileData = new FetchFile();
      fileData.content = file.buffer.toString();
      response.data = fileData;
      return response;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
