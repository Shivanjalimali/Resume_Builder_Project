import React from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { useState } from 'react'
import { useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import {Inputs }from './Inputs';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';
const SignUp = ({setCurrentPage}) => {
    const[fullName,setFullName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState(null);
    const {updateUser}=useContext(UserContext);
    const navigate=useNavigate();
   
    const handleSignUp=async(e)=>{
        e.preventDefault();
        if(!fullName)
        {
            setError('Please enter fullName')
            return;
        }
        if(!validateEmail(email))
        {
            setError("Please enter the valid email address")
            return;
        }
        if(!password)
        {
            setError('Please enter the password')
            return;
        }
        setError('');
        try {
            const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
                name:fullName,
                email,
                password
            });
            const token=response.data;
            if(token)
            {
                localStorage.setItem('token',token);
                updateUser(response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message||'Something went wrong. please try again')
        }
    }

  return (
    <div className={styles.signupContainer}>
        <div className={styles.headerWrapper}>
            <h3 className={styles.signupTitle}>Create Account</h3>
            <p className={styles.signupSubtitle}>Join thousands of professionals today.</p>
        </div>
        {/* FORM */}
        <form onSubmit={handleSignUp} className={styles.signupForm}>
            <Inputs value={fullName} onChange={({target})=>setFullName(target.value)}
            label="fullName"
            placeholder="John Doe"
            type="text"/>
            <Inputs value={email} onChange={({target})=>setEmail(target.value)}
            label="Email"
            placeholder="email@gmail.com"
            type="email"/>
            <Inputs value={password} onChange={({target})=>setPassword(target.value)}
            label="password"
            placeholder="min 8 character password is required"
            type="password"/>

            {error && <div className={styles.errorMessage}>{error}</div>}
            <button type='submit' className={styles.signupSubmit}>
                Create Account
            </button>
            {/* FOOTER */}
            <p className={styles.switchText}>
                Already have an account?{' '}
                <button onClick={()=>setCurrentPage('login')}
                 type='button' className={styles.signupSwitchButton}>
                    Sign In
                 </button>
            </p>
        </form>      
    </div>
  )
}

export default SignUp
