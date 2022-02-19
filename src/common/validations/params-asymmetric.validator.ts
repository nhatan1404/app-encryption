import * as Joi from 'joi';
import * as config from 'config';

const KeyPairSchema: Joi.ObjectSchema = Joi.object({
  bitSize: Joi.number()
    .required()
    .min(config.get('rsa.minKeySize'))
    .max(config.get('rsa.maxKeySize'))
    .messages({
      'any.required': `"keysize" is not allowed to be empty`,
      'number.base': `"keysize" must be numeric`,
      'number.min': `"keysize"  must be greater than or equal to {#limit}`,
      'number.max': `"keysize"  must be less than or equal to {#limit}`,
    }),
  passphrase: Joi.string().required().messages({
    'any.required': `"passphrase" is not allowed to be empty`,
    'string.base': `"passphrase" should be a type of 'text'`,
  }),
});

const BaseSchema: Joi.ObjectSchema = Joi.object({
  key: Joi.string().required().messages({
    'any.required': `"key" is not allowed to be empty`,
    'string.base': `"key" should be a type of 'text'`,
  }),
  isPublicKey: Joi.boolean().required(),
  passphrase: Joi.string().required().messages({
    'any.required': `"passphrase" is not allowed to be empty`,
    'string.base': `"passphrase" should be a type of 'text'`,
  }),
});

const TextAsymmetricSchema: Joi.ObjectSchema = BaseSchema.keys({
  data: Joi.string().required().messages({
    'any.required': `"data" is not allowed to be empty`,
    'string.base': `"data" should be a type of 'text'`,
  }),
});

const FileAsymmetricSchema: Joi.ObjectSchema = BaseSchema;

const FileAsymmetricAdvancedSchema: Joi.ObjectSchema = BaseSchema.keys({
  algorithm: Joi.string().required().messages({
    'string.base': `"algorithm" should be a type of 'text'`,
    'any.required': `"algorithm' is not allowed to be empty`,
  }),
  symKey: Joi.string().required().messages({
    'string.base': `"key" should be a type of 'text'`,
    'any.required': `"key" is not allowed to be empty`,
  }),
  isHexKey: Joi.boolean().required(),
  isHexIv: Joi.boolean(),
  iv: Joi.optional(),
});

export {
  KeyPairSchema,
  TextAsymmetricSchema,
  FileAsymmetricSchema,
  FileAsymmetricAdvancedSchema,
};
