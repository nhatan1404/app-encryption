import {
  ParamsHashSchema,
  ParamsVerifySchema,
} from '../validations/hash.validator';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ParamsHash, ParamsVerifyChecksum } from '../types/hash.type';
import { getListHashes } from '../utils/hash.util';
import Joi from 'joi';
import { Algo } from '../types/algorithm.type';

const validate = (
  value: ParamsHash | ParamsVerifyChecksum,
  schema: Joi.ObjectSchema,
): ParamsHash | ParamsVerifyChecksum => {
  const { error } = schema.validate(value);
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }
  const list: Algo[] = getListHashes();
  if (!list.find((hash) => hash.id === value.algorithm))
    throw new BadRequestException(`"algorithm" is not valid or not support`);
  return value;
};

@Injectable()
class ParamsHashValidationPipe implements PipeTransform {
  transform(value: ParamsHash): ParamsHash {
    return validate(value, ParamsHashSchema);
  }
}

@Injectable()
class ParamsVerifyValidationPipe implements PipeTransform {
  transform(value: ParamsHash): ParamsHash {
    return validate(value, ParamsVerifySchema);
  }
}

export { ParamsHashValidationPipe, ParamsVerifyValidationPipe };
