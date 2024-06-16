const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseController');
const authMiddleware=require('../middleware/authMiddleware')

router.post('/create',authMiddleware, expenseController.createExpense);
router.get('/get', authMiddleware,expenseController.getAllExpenses);
router.put('/edit/:id', authMiddleware,expenseController.updateExpense);
router.delete('/delete/:id', authMiddleware,expenseController.deleteExpense);
router.get('/download', authMiddleware, expenseController.downloadExpenses);

module.exports = router;
