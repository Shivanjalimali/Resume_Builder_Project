import mongoose from 'mongoose'
export const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://shivanjali7266_db_user:Shivanjali%40416408@cluster0.k5rzglb.mongodb.net/ResumeBuilderDB')

    .then(()=>console.log("DB IS CONNECTED"));
    
}