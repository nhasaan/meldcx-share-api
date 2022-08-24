import { IsNotEmpty } from 'class-validator';

export class FetchFile {
  @IsNotEmpty()
  content: any;
}
