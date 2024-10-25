const Todo =require('../models/todoModel');



const AddTodo=async (req,res)=>{
    const {title,description}=req.body;
    const userId=req.user._id;
    try {
        const newTodo=new Todo({
            title:title,
            description:description,
            owner:userId,
        });
        await newTodo.save();
        return res.status(200).json({message:"todo added "});
        
    } catch (error) {
       return  res.status(400).json({message:"error while adding todo"});
        
    }
}

//getting the todo  list of the owner who asked for theirs
const getTodo= async(req,res)=>{
    const userId=req.user._id;
    try {
        const todos=Todo.find({owner:userId});
         return res.status(200).json({message:"here are your todos"});

    } catch (error) {
        return res.status(400).json({message:"error while retriveing the todos"});
    }
}

//deleting the todos 
const deleteTodos=async(req,res)=>{
    const TodoId=req.params.id;
    try {
        await Todo.findByIdAndDelete({TodoId});
        return res.status(200).json({message:"todo deleted Ssuxxefullt"});
    } catch (error) {
        return res.status(400).json({message:"error while deleting todo"});
    }
}
const updateTodo=async(req,res)=>{
    const TodoId=req.params.id;
    try{
        await Todo.findByIdAndUpdate(TodoId);
        return res.status(200).json({message:"updated the todo"});
    }
    catch(error){
        return res.status(400).json({message:"error while updating todo"});
    }
}
module.exports={AddTodo,getTodo,deleteTodos,updateTodo};