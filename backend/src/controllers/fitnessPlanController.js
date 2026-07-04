import FitnessPlan from '../models/FitnessPlan.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import * as aiService from '../services/aiService.js';

// @desc    Generate a new AI fitness plan
// @route   POST /api/v1/fitness-plans
// @access  Private
export const generatePlan = catchAsync(async (req, res, next) => {
  const fitnessProfile = req.body;

  const aiGeneratedPlan = await aiService.generateFitnessPlan(fitnessProfile);

  const plan = await FitnessPlan.create({
    user: req.user._id,
    fitnessProfile,
    aiGeneratedPlan,
  });

  res.status(201).json({ success: true, data: { plan } });
});

// @desc    Regenerate an existing plan with the same profile (creates new plan record)
// @route   POST /api/v1/fitness-plans/:id/regenerate
// @access  Private
export const regeneratePlan = catchAsync(async (req, res, next) => {
  const existingPlan = await FitnessPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!existingPlan) {
    return next(new ApiError(404, 'Fitness plan not found'));
  }

  const aiGeneratedPlan = await aiService.generateFitnessPlan(existingPlan.fitnessProfile);

  const newPlan = await FitnessPlan.create({
    user: req.user._id,
    fitnessProfile: existingPlan.fitnessProfile,
    aiGeneratedPlan,
  });

  res.status(201).json({ success: true, data: { plan: newPlan } });
});

// @desc    Get all fitness plans for logged-in user
// @route   GET /api/v1/fitness-plans
// @access  Private
export const getMyPlans = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    FitnessPlan.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(limit),
    FitnessPlan.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    results: plans.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: { plans },
  });
});

// @desc    Get single fitness plan by ID (must belong to user)
// @route   GET /api/v1/fitness-plans/:id
// @access  Private
export const getPlanById = catchAsync(async (req, res, next) => {
  const plan = await FitnessPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) {
    return next(new ApiError(404, 'Fitness plan not found'));
  }
  res.status(200).json({ success: true, data: { plan } });
});

// @desc    Delete a fitness plan (must belong to user)
// @route   DELETE /api/v1/fitness-plans/:id
// @access  Private
export const deletePlan = catchAsync(async (req, res, next) => {
  const plan = await FitnessPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!plan) {
    return next(new ApiError(404, 'Fitness plan not found'));
  }
  res.status(200).json({ success: true, message: 'Fitness plan deleted successfully' });
});

// @desc    Add a progress log entry to a plan (bonus: progress tracking)
// @route   POST /api/v1/fitness-plans/:id/progress
// @access  Private
export const addProgressLog = catchAsync(async (req, res, next) => {
  const { weight, notes } = req.body;

  const plan = await FitnessPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) {
    return next(new ApiError(404, 'Fitness plan not found'));
  }

  plan.progressLogs.push({ weight, notes, date: new Date() });
  await plan.save();

  res.status(201).json({ success: true, data: { plan } });
});
