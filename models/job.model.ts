import mongoose from "mongoose";



const jobSchema = new mongoose.Schema({
    name : {type : String, required : true},
    jenis : String,
    jabatan : String,
    owner : {type : mongoose.Types.ObjectId , ref : 'User'},
    contact_id : {type : mongoose.Types.ObjectId}
})

const Job = mongoose.models.Job || mongoose.model('Job',jobSchema)

export default Job