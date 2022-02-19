import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import {
  TextParamsAsymmetric,
  FileParamsAsymmetric,
} from '../types/params-asymmetric.type';
import {
  TextAsymmetricSchema,
  FileAsymmetricSchema,
  FileAsymmetricAdvancedSchema,
} from '../validations/params-asymmetric.validator';
import { convertToBoolean } from '../utils/normalize';

const options = { abortEarly: false };

@Injectable()
class TextAsymmetricPipe implements PipeTransform {
  async transform(value: TextParamsAsymmetric) {
    return this.validate(value);
  }

  private validate(value: TextParamsAsymmetric) {
    const { error } = TextAsymmetricSchema.validate(value, options);
    if (error) throw new BadRequestException(error.details);
    return value;
  }
}

@Injectable()
class FileAsymmetricPipe implements PipeTransform {
  async transform(value) {
    value = convertToBoolean(value);
    return this.validate(value);
  }

  private validate(value: FileParamsAsymmetric) {
    const { error } = FileAsymmetricSchema.validate(value);
    if (error) throw new BadRequestException(error.details);
    return value;
  }
}

@Injectable()
class FileAsymmetricAdvancedPipe implements PipeTransform {
  async transform(value) {
    value = convertToBoolean(value);
    return this.validate(value);
  }

  private validate(value: FileParamsAsymmetric) {
    const { error } = FileAsymmetricAdvancedSchema.validate(value);
    if (error) throw new BadRequestException(error.details);
    return value;
  }
}

export { TextAsymmetricPipe, FileAsymmetricPipe, FileAsymmetricAdvancedPipe };
