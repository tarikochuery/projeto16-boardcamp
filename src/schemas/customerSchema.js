import Joi from "joi";

export const customerSchema = Joi.object({
  name: Joi.string()
    .required(),
  cpf: Joi.string()
    .pattern(/^[0-9]+$/, 'numbers')
    .length(11)
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/, 'numbers')
    .min(10)
    .max(11)
    .required(),
  birthday: Joi.string()
    .isoDate()
    .required()
});