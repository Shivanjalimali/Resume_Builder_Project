import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//generate the token
const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"})
}

export const registerUser=async(req,res)=>{
    try
    {
        const {name,email,password}=req.body;
        //check if user already exists
        const userExists=await User.findOne({email});
        if(userExists)
        {
            return res.status(400).json("user already exists");
        }
        if(password.length<8)
        {
            return res.status(400).json({success:false,message:"the password should be of at least 8  characters"});
        }
        //HASHING PASSWORD
        //Crptographiy concept used for hashing
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        //create User
        const user=await User.create(
            {
                name,
                email,
                password:hashedPassword,
            }
        )
        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }
    catch(error)
    {
        return res.status(500).json({
            message:"server error",
            error:error.message
        })
    }
}

//LOGIN FUNCTION
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({message:"Invalid Email Or password"});
        }
        //compare the passowrd
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(401).json({message:"Invalid Email Or password"});
        }
        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
        
    }
    catch(error)
    {
        return res.status(500).json({
            message:"server error",
            error:error.message
        })
    }
}

///GET USER PROFILE FUNCTION
export const getUserProfile=async(req,res)=>{
    try
    {
        const user=await User.findById(req.user.id).select("-password");
        if(!user)
        {
            return res.status(404).json({message:"user not found"});
        }
        return res.json(user);
    }
    catch(error)
    {
        return res.status(500).json({
            message:"server error",
            error:error.message
        })
    }
}