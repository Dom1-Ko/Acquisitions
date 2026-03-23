import { deleteUserById, fetchAllUsers, fetchUserById, updateUserById } from '#controllers/users.controller.js';
import express from 'express';
import { authenticateToken, requireRole } from '#middlewares/auth.midlleware.js';

const router = express.Router();

// get all users (admin only)
router.get('/', fetchAllUsers);

// get user by id (authenticated users only)
router.get('/:id', authenticateToken, fetchUserById);

// update user by id (authenticated users can update own profile, admin can update any profile)
router.put('/:id', authenticateToken, updateUserById); // update data is sent using the request body

// delete user by id (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteUserById);       

export default router;