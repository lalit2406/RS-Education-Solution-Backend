import express from 'express';
import {
  getUniversities,
  getUniversityById,
  downloadUniversityPDF
} from '../controllers/universityController.js';

const router = express.Router();

router.route('/').get(getUniversities);
router.route('/:id').get(getUniversityById);
router.route('/:id/download').get(downloadUniversityPDF);

export default router;
