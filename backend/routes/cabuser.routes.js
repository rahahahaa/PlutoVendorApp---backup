import express from 'express';
import { signup, login, updateCabUser, getCabUserById } from '../controllers/cabuser.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update/:id', updateCabUser);
router.get('/:id', getCabUserById);  // New GET endpoint to fetch user profile by ID

export default router;
