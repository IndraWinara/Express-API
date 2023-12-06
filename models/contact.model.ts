import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    owner : {type : mongoose.Types.ObjectId , ref : 'User'},
    jobs : [{type : mongoose.Types.ObjectId , ref : 'Job'}],
    address: [{type : mongoose.Types.ObjectId , ref : 'Addres'}]
  },
  { timestamps: true }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
