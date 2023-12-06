import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    email : {type : String, required : true, unique : true},
    password : String,
    image : {type : String, default : ''},
    bio : {type : String, default : ''},
    contact : [{type : mongoose.Types.ObjectId, ref : 'Contact'}],
},{timestamps : true})

const User = mongoose.models.User || mongoose.model('User',userSchema)
export default User;