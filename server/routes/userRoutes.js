import express from 'express';
import { getAllUsers, addMember, removeMember, getUserRoleInGroup, leaveGroup } from "../controllers/userController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router=express.Router();

router.get('/allUsers', authMiddleware, getAllUsers);
router.post('/add-member', authMiddleware, addMember);
router.post('/remove-member', authMiddleware, removeMember);
router.get('/getRole/:userId', authMiddleware, getUserRoleInGroup)
router.post('/leave-group', authMiddleware, leaveGroup);

export default router;