const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.plasticSchema = Joi.object({
        description: Joi.string().required(),
        title: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string(),
        deleteImages: Joi.array(),
        notes: Joi.string().allow('', null),
        latitude: Joi.number(),
        longitude: Joi.number(),
});



