const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().trim().min(1).max(100)
      .pattern(/^[\w\s\-.,!'"()[\]]+$/) // Allow common punctuation but prevent script injection
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 1 character long',
        'string.max': 'Title cannot exceed 100 characters',
        'string.pattern.base': 'Title contains invalid characters'
      }),
    description: Joi.string().allow("", null).trim().max(1000)
      .pattern(/^[\w\s\-.,!'"()[\]\n\r]*$/) // Allow common punctuation and line breaks
      .messages({
        'string.max': 'Description cannot exceed 1000 characters',
        'string.pattern.base': 'Description contains invalid characters'
      }),
    price: Joi.number().required().min(0).max(1000000).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least 0',
      'number.max': 'Price cannot exceed 1,000,000'
    }),
    location: Joi.string().required().trim().min(1).max(200)
      .pattern(/^[\w\s\-.,'"()[\]]+$/) // Allow common punctuation
      .messages({
        'string.empty': 'Location is required',
        'string.min': 'Location must be at least 1 character long',
        'string.max': 'Location cannot exceed 200 characters',
        'string.pattern.base': 'Location contains invalid characters'
      }),
    country: Joi.string().required().trim().min(1).max(100)
      .pattern(/^[\w\s\-.,'"()[\]]+$/) // Allow common punctuation
      .messages({
        'string.empty': 'Country is required',
        'string.min': 'Country must be at least 1 character long',
        'string.max': 'Country cannot exceed 100 characters',
        'string.pattern.base': 'Country contains invalid characters'
      }),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).integer().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'number.integer': 'Rating must be a whole number'
    }),
    comment: Joi.string().required().trim().min(1).max(500)
      .pattern(/^[\w\s\-.,!'"()[\]\n\r]*$/) // Allow common punctuation and line breaks
      .messages({
        'string.empty': 'Comment is required',
        'string.min': 'Comment must be at least 1 character long',
        'string.max': 'Comment cannot exceed 500 characters',
        'string.pattern.base': 'Comment contains invalid characters'
      }),
  }).required(),
});
