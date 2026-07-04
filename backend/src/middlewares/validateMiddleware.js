import ApiError from '../utils/ApiError.js';

/**
 * Generic schema-based validator.
 * Accepts a validate function per resource and validates req.body,
 * returning readable errors via ApiError.
 */
export default (validatorFn) => (req, res, next) => {
  const { error } = validatorFn(req.body);
  if (error) {
    const message = error.details
      ? error.details.map((d) => d.message).join(', ')
      : error.message;
    return next(new ApiError(400, message));
  }
  next();
};
