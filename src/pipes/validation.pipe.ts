import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length) {
      throw new HttpException('Validation error..', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
