import * as Joi from 'joi';

const ParamsHashSchema: Joi.ObjectSchema = Joi.object({
  algorithm: Joi.string().required().messages({
    'any.required': `"algorithm" is not allowed to be empty`,
    'string.base': `"algorithm" should be a type of 'text'`,
  }),
});

const ParamsVerifySchema: Joi.ObjectSchema = ParamsHashSchema.keys({
  hash: Joi.string().required().messages({
    'any.required': `"hash" is not allowed to be empty`,
    'string.base': `"hash" should be a type of 'text'`,
  }),
});

export { ParamsHashSchema, ParamsVerifySchema };
