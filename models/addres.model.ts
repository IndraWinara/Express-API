import mongoose from "mongoose";



const addresSchema = new mongoose.Schema({
    country : {type : String, required : true},
    town : {type : String, required : true},
    addreses : {type : String, required : true},
    zip_code : String,
    owner : {type : mongoose.Types.ObjectId, ref : 'User'},
    contact_id : {type : mongoose.Types.ObjectId, ref: 'Contact'}
})




const Addres = mongoose.models.Addres || mongoose.model('Addres',addresSchema)

export default Addres