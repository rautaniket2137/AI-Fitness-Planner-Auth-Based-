import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyToken } from '../utils/jwt.js';

// Protect routes - user must be authenticated
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new ApiError(401, 'You are not logged in. Please log in to access this resource.'));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
  }

  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < changedTimestamp) {
      return next(new ApiError(401, 'Password was recently changed. Please log in again.'));
    }
  }

  req.user = currentUser;
  next();
});

// Restrict to specific roles
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};
