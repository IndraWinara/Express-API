import mongoose from "mongoose";
require('dotenv').config()

const dbUrl : string = process.env.DB_URI || '' 

const connectDb = async () => {
    try {
        await mongoose.connect(dbUrl)
        .then(()=>{
            console.log('mongodb connected')
        })
    } catch (error) {
        console.log(`Mongodb disconnected`)
        setTimeout(connectDb,4000)
    }
}

export default connectDb;