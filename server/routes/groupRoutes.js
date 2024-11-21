import express from 'express';
import { createGroup, getUserGroups, getGroupDetails, deleteGroup } from '../controllers/groupController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createGroup);
router.get('/user-groups', authMiddleware, getUserGroups);
router.get('/details/:groupId', authMiddleware, getGroupDetails);
router.delete('/delete/:groupId', authMiddleware, deleteGroup);

export default router;
