import {
  TextParamsSchema,
  FileParamsSchema,
} from '../validations/params-symmetric.validator';
import {
  TextParamsSymmetric,
  FileParamsSymmetric,
} from '../types/params-symmetric.type';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Algorithm } from '../types/algorithm.type';
import Joi from 'joi';
import { getCipherInfo } from '../constants/list-ciphers';
import { convertToBoolean } from '../utils/normalize';

const validate = (
  value: TextParamsSymmetric | FileParamsSymmetric,
  schemaValidator: (
    keyLength: number,
    ivLength: number,
    isHexKey: boolean,
    isHexIv: boolean,
  ) => Joi.ObjectSchema,
) => {
  const { algorithm, key, iv, isHexKey, isHexIv } = value as
    | TextParamsSymmetric
    | FileParamsSymmetric;
  const algoInfo: Algorithm = getCipherInfo(algorithm);

  if (!algorithm || !algoInfo) {
    throw new BadRequestException('"algorithm" is not valid or not support');
  }

  const keyLength: number =
    key && isHexKey === true
      ? Buffer.alloc(algoInfo.keyLength).toString('hex').length
      : algoInfo.keyLength;

  const isHasIV: boolean = algoInfo.hasOwnProperty('ivLength');
  const ivLength: number =
    (iv && isHasIV && isHexIv) === true // case has iv and iv is hex string
      ? Buffer.alloc(algoInfo.ivLength).toString('hex').length
      : isHasIV // case has iv and iv is normal string
      ? algoInfo.ivLength
      : 0;

  const schema: Joi.ObjectSchema = schemaValidator(
    keyLength,
    ivLength,
    isHexKey,
    isHexIv,
  );

  const { error } = schema.validate(value);
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }

  const keyValue: any = key;
  const ivValue: any = iv || '';

  return {
    ...value,
    key:
      key && isHexKey === true
        ? Buffer.from(keyValue, 'hex')
        : Buffer.from(keyValue),
    iv:
      iv && isHexIv === true
        ? Buffer.from(ivValue, 'hex')
        : Buffer.from(ivValue),
  };
};

@Injectable()
class TextParamsValidationPipe implements PipeTransform {
  async transform(value: TextParamsSymmetric) {
    return validate(value, TextParamsSchema);
  }
}

@Injectable()
class FileParamsValidationPipe implements PipeTransform {
  async transform(value: FileParamsSymmetric) {
    value = convertToBoolean(value);
    return validate(value, FileParamsSchema);
  }
}

export { TextParamsValidationPipe, FileParamsValidationPipe };
