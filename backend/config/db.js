import mongoose from 'mongoose'
export const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://shivanjali7266_db_user:resume123@cluster0.k5rzglb.mongodb.net/RESUME')
    .then(()=>console.log("DB IS CONNECTED"));
    
}