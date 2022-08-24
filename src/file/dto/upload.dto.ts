import { IsString } from 'class-validator';
export class UploadFileDto {
  @IsString()
  fileExt?: string = 'txt';

  @IsString()
  arbitaryText?: string = 'testing_upload';
}
