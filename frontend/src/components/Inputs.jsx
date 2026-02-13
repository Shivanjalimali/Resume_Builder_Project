import React, { useState } from 'react'
import { inputStyles } from '../assets/dummystyle'
import { EyeOff } from 'lucide-react';
import { Eye } from "lucide-react";

export const Inputs = ({value,onChange,label,placeholder,type='text'}) => {
    const[showPassword,setShowpassword]=useState(false);
    const [isFocused,setIsFocused]=useState(false);
    const styles=inputStyles;
  return (
    <div className={styles.wrapper}>
        {label&& <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer(isFocused)}>
            <input type={type==='password'?(showPassword? 'text':'password'):type} 
            placeholder={placeholder}
            className={styles.inputField}
            value={value}
            onChange={onChange}
            onFocus={()=>setIsFocused(true)}
            onBlur={()=>setIsFocused(false)}/>
            {type==='password'&&(
                <button type='button' onClick={()=>setShowpassword(!showPassword)} className={styles.toggleButton}>
                    {showPassword?<EyeOff size={20}/>:<Eye size={20}/>}
                </button>
            )}
        </div>
    </div>
  )
}

export default Inputs;
