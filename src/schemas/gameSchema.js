import Joi from "joi";

export const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  stockTotal: Joi.number().not(null).positive().required(),
  pricePerDay: Joi.number().not(null).positive().required()
});