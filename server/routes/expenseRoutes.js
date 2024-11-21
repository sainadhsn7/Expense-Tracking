import express from 'express';
import { createExpense, getGroupExpenses, getExpenseDetails, uploadExpenseProof, updateExpenseStatus, verifyExpense } from '../controllers/expenseController.js';
import upload from '../config/multerConfig.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/group/:groupId/createExpense', authMiddleware, createExpense);
router.get('/group/:groupId/expenses', authMiddleware, getGroupExpenses);
router.get('/:expenseId', authMiddleware, getExpenseDetails);
router.post('/:groupId/upload-proof/:expenseId', authMiddleware, upload.single('proof'), uploadExpenseProof);
router.put('/:groupId/update-status/:expenseId', authMiddleware, updateExpenseStatus);
router.put('/:groupId/verify-expense/:expenseId', authMiddleware, verifyExpense);

export default router;
