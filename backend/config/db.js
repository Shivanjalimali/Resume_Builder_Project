import mongoose from 'mongoose'
export const connectDB= async()=>{
        console.log("MONGO_URL:", process.env.MONGO_URL); // temporary debug

    await mongoose.connect(process.env.MONGO_URL)

    .then(()=>console.log("DB IS CONNECTED"));
    
}