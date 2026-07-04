const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

const toErrorResult = (errors) =>
  errors.length ? { error: { details: errors.map((message) => ({ message })) } } : {};

export const validateRegister = ({ name, email, password } = {}) => {
  const errors = [];

  if (!name?.trim() || name.trim().length < MIN_NAME_LENGTH) {
    errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters`);
  }
  if (!email || !EMAIL_REGEX.test(email)) errors.push('A valid email is required');
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  return toErrorResult(errors);
};

export const validateLogin = ({ email, password } = {}) => {
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) errors.push('A valid email is required');
  if (!password) errors.push('Password is required');

  return toErrorResult(errors);
};
