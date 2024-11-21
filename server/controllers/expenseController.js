import {Group} from '../models/userModel.js';
import cloudinary from '../config/cloudinaryConfig.js';

export const createExpense = async (req, res) => {
    const { groupId } = req.params;
    const { cost, purpose, payer, assignee } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const newExpense = {
            cost,
            purpose,
            payer,
            assignee,
            status: 'pending',
            proof: ''
        };

        group.expenses.push(newExpense);
        await group.save();

        res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId).populate('expenses.assignee expenses.payer', 'name email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group.expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getExpenseDetails = async (req, res) => {
    const { expenseId } = req.params;

    try {
        const group = await Group.findOne({ 'expenses._id': expenseId })
            .populate('expenses.assignee expenses.payer', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const expense = group.expenses.id(expenseId);

        res.status(200).json(expense);
    } catch (error) {
        console.error('Error retrieving expense details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const uploadExpenseProof = async (req, res) => {
    try {
      const { expenseId, groupId } = req.params;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      const expense = group.expenses.id(expenseId);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      expense.proof = result.secure_url;
      await group.save();
  
      res.status(200).json({ message: 'Proof uploaded successfully', proof: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading proof', error: error.message });
    }
  };

export const updateExpenseStatus = async (req, res) => {
  try {
    const { expenseId, groupId } = req.params;
    const { status } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expense = group.expenses.id(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.status = status;
    await group.save();

    res.status(200).json({ message: 'Expense status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense status', error: error.message });
  }
};

export const verifyExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { groupId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        const expense = group.expenses.id(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        if (expense.status !== 'fulfilled') {
            return res.status(400).json({ message: 'Expense must be fulfilled to be verified.' });
        }

        expense.status = 'verified';
        await group.save();

        res.status(200).json({ message: 'Expense verified successfully.' });
    } catch (error) {
        console.error('Error verifying expense:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};