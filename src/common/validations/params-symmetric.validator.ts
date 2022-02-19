import * as Joi from 'joi';

const message = (name: string, isBuffer: boolean) => {
  const typeMessage: string = isBuffer ? 'hex characters' : 'bytes';
  return `"${name}" is not valid. Key must be {#limit} ${typeMessage}`;
};

const BaseSchema = (
  keyLength: number,
  ivLength: number,
  isHexKey: boolean,
  isHexIv: boolean,
): Joi.ObjectSchema => {
  // Original Schema
  const schema: Joi.ObjectSchema = Joi.object({
    algorithm: Joi.string().required().messages({
      'string.base': `"algorithm" should be a type of 'text'`,
      'any.required': `"algorithm' is not allowed to be empty`,
    }),
    isHexKey: Joi.boolean().required(),
    isHexIv: Joi.boolean(),
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

  if (ivLength === 0)
    return schema.keys({
      iv: Joi.optional(),
    });
  return schema
    .keys({
      iv: Joi.when('isHexIv', {
        is: Joi.exist().valid(true),
        then: Joi.string().min(ivLength).max(ivLength).hex(),
        otherwise: Joi.string().min(ivLength).max(ivLength),
      }),
    })
    .messages({
      'string.base': `"iv" should be a type of 'text'`,
      'string.max': message('iv', isHexIv),
      'string.min': message('iv', isHexIv),
      'string.hex': `"iv" is not a valid hexadecimal string`,
      'any.required': `"iv" is not allowed to be empty`,
    });
};

const FileParamsSchema = (
  keyLength: number,
  ivLength: number,
  isHexKey: boolean,
  isHexIv: boolean,
): Joi.ObjectSchema => {
  return BaseSchema(keyLength, ivLength, isHexKey, isHexIv).keys({
    files: Joi.any(),
  });
};

const TextParamsSchema = (
  keyLength: number,
  ivLength: number,
  isHexKey: boolean,
  isHexIv: boolean,
): Joi.ObjectSchema => {
  return BaseSchema(keyLength, ivLength, isHexKey, isHexIv).keys({
    text: Joi.string().required().messages({
      'string.base': `"text" should be a type of 'text'`,
      'any.required': `"text" is not allowed to be empty`,
    }),
  });
};

export { TextParamsSchema, FileParamsSchema };
