import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

const message = (name: string, isBuffer: boolean) => {
  const typeMessage: string = isBuffer ? 'hex characters' : 'bytes';
  return `"${name}" is not valid. ${name} must be {#limit} ${typeMessage}`;
};

const KeySchema = (keyLength: number, isHexKey: boolean): Joi.ObjectSchema => {
  return Joi.object({
    key: Joi.string()
      .required()
      .min(keyLength)
      .max(keyLength)
      .when('isHexKey', {
        is: true,
        then: Joi.string().hex(),
      })
      .messages({
        'string.base': `"key" should be a type of 'text'`,
        'string.max': message('key', isHexKey),
        'string.min': message('key', isHexKey),
        'string.hex': `"key" is not a valid hexadecimal string`,
        'any.required': `"key" is not allowed to be empty`,
      }),
  });
};

export default function validateKey(
  key: string | Buffer,
  keyLength: number,
  isHexKey: boolean,
): void {
  const schema = KeySchema(keyLength, isHexKey);
  const { error } = schema.validate({ key });
  if (error) {
    throw new BadRequestException(error.details[0].message);
  }
}
