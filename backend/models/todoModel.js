const mongoose=require('mongoose');
// making the schema
const todoSchema= new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String},
    status:{type:Boolean,default:false},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
})
todoSchema.pre('save', async function (next) {
    this.updatedAt = Date.now();
    next();
  });
const Todo =  mongoose.model('Todo',todoSchema);
module.exports=Todo;