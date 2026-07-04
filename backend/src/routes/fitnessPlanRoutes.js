import express from 'express';
import * as fitnessPlanController from '../controllers/fitnessPlanController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { validateFitnessProfile } from '../validators/fitnessPlanValidator.js';

const router = express.Router();

// All routes below require authentication
router.use(protect);

router
  .route('/')
  .get(fitnessPlanController.getMyPlans)
  .post(validate(validateFitnessProfile), fitnessPlanController.generatePlan);

router
  .route('/:id')
  .get(fitnessPlanController.getPlanById)
  .delete(fitnessPlanController.deletePlan);

router.post('/:id/regenerate', fitnessPlanController.regeneratePlan);
router.post('/:id/progress', fitnessPlanController.addProgressLog);

export default router;
