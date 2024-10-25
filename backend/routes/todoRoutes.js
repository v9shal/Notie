const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { AddTodo, getTodo, deleteTodos, updateTodo } = require('../controllers/todoController');

router.post('/addTodo', protect, AddTodo);
router.get('/getTodo', protect, getTodo);
router.delete('/deleteTodo/:id', protect, deleteTodos);
router.put('/updateTodo/:id', protect, updateTodo);

module.exports = router;