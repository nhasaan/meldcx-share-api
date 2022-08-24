import { IsString } from 'class-validator';

export class ResultResponse {
  @IsString()
  url = 'google.com';
}
