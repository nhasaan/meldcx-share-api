import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

export class UploadResponse {
  @IsString()
  fileKey: string = uuid();

  @IsNotEmpty()
  owner: Types.ObjectId;

  @IsString()
  fileExt?: string;

  @IsString()
  fileName?: string;
}
