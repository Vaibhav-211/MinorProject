const Joi = require("joi");

module.exports.eventSchema = Joi.object({
  event: Joi.object({
    eventName: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    startDateTime: Joi.date().iso().required(),
    endDateTime: Joi.date().iso().required(),
    price: Joi.number().min(0).required(),
    venueType: Joi.string().valid("Indoor", "Outdoor", "Virtual").required(),
    image: Joi.object({
      url: Joi.string().allow("", null).required()
    }).allow(null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});