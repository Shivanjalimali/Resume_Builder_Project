import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js'

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const app=express();
const PORT=4000;
app.use(cors());
//connect with db
connectDB();
//middleware
app.use(express.json());
app.use('/api/auth',userRoutes)
app.use('/api/resume',resumeRoutes)
app.use('/uploads',
    express.static(path.join(__dirname,'uploads'),{
        setHeaders:(res,_path)=>{
            res.set('Acess-Control-Allow-Origin','http://localhost:5173')
        }
    })

)

app.listen(PORT,()=>{
    console/console.log("server started");
    
})
//routes
app.get('/',(req,res)=>{
    res.send("API working");
})