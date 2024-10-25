const Todo = require('../models/todoModel');

const AddTodo = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title?.trim()) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const newTodo = new Todo({
            title: title.trim(),
            description: description?.trim() || "",
            owner: userId,
        });
        await newTodo.save();
        return res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error adding todo:', error);
        return res.status(500).json({ message: "Internal server error while adding todo" });
    }
}

const getTodo = async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const todos = await Todo.find({ owner: userId }).sort({ createdAt: -1 });
        return res.status(200).json(todos);
    } catch (error) {
        console.error('Error retrieving todos:', error);
        return res.status(500).json({ message: "Internal server error while retrieving todos" });
    }
}

const deleteTodos = async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!todoId) {
        return res.status(400).json({ message: "Todo ID is required" });
    }

    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, owner: userId });
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json(deletedTodo);
    } catch (error) {
        console.error('Error deleting todo:', error);
        return res.status(500).json({ message: "Internal server error while deleting todo" });
    }
}

const updateTodo = async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user?._id;
    const { title, description, status } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!todoId) {
        return res.status(400).json({ message: "Todo ID is required" });
    }

    try {
        const updates = {
            ...(title && { title: title.trim() }),
            ...(description !== undefined && { description: description.trim() }),
            ...(status !== undefined && { status })
        };

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, owner: userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        return res.status(500).json({ message: "Internal server error while updating todo" });
    }
}

module.exports = { AddTodo, getTodo, deleteTodos, updateTodo };