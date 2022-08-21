import { IsArray, IsBoolean, IsObject, IsOptional } from 'class-validator';
import { ErrorMessage } from './error-message.dto';

export interface ICommandResponse<T> {
  success: boolean;
  message?: string;
  errors?: ErrorMessage[];
  data?: T;
}

export class CommandResponse<T> implements ICommandResponse<T> {
  @IsBoolean()
  success = true;

  @IsOptional()
  @IsArray()
  message?: string;

  @IsOptional()
  @IsArray()
  errors?: ErrorMessage[] = [];

  @IsOptional()
  @IsObject()
  data?: T = null;

  constructor(arg?: ICommandResponse<T>) {
    this.success = arg?.success;
    this.message = arg?.message;
    this.errors = arg?.errors;
    this.data = arg?.data;
  }
}
