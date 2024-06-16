const Expense = require("../models/expenseModel");
const User = require("../models/userModals");
const ExcelJS = require("exceljs");

// Create expense
const createExpense = async (req, res) => {
  try {
    const { name, category, amount } = req.body;
    const newExpense = new Expense({
      name,
      category,
      amount,
      userId: req.user.id,
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all expenses for the authenticated user
const getAllExpenses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;

  try {
    // Count total number of expenses for the user
    const totalCount = await Expense.countDocuments({ userId: req.user.id });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / perPage);

    // Retrieve expenses for the current page
    const expenses = await Expense.find({ userId: req.user.id })
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Return total number of pages and expenses for the current page
    res.status(200).json({ totalPages, expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update expense by ID
const updateExpense = async (req, res) => {
  try {
    const { name, category, amount } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, category, amount },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete expense by ID
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download expenses in Excel
const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Manually find expenses for debugging
    const expenses = await Expense.find({ userId });

    const user = await User.findById(userId).populate("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "isPrimium") {
      return res
        .status(403)
        .json({ error: "Only premium users can download expenses" });
    }

    if (!user.expenses.length) {
      return res.status(200).json({ message: "No expenses to download" });
    }

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    worksheet.columns = [
      { header: "ID", key: "_id", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Category", key: "category", width: 30 },
      { header: "Date", key: "createdAt", width: 20 },
    ];

    user.expenses.forEach((expense) => {
      const row = {
        _id: expense._id.toString(),
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        createdAt: expense.createdAt.toLocaleString(),
      };
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading expenses:", error);
    res.status(500).json({ error: "Error downloading expenses" });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  downloadExpenses,
};
