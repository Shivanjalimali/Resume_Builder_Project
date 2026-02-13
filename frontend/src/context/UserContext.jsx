import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    if(user) return;

    const accessToken = localStorage.getItem('token');

    if(!accessToken){
      setLoading(false);
      return;
    }

    const fetchUser = async()=>{
      try{
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      }catch(error){
        clearUser();
      }finally{
        setLoading(false);
      }
    }

    fetchUser();
  },[]);

  const updateUser=(userData)=>{
    setUser(userData);
    localStorage.setItem('token', userData.token);
  }

  const clearUser=()=>{
    setUser(null);
    localStorage.removeItem('token');
  }

  return(
    <UserContext.Provider value={{user, loading, clearUser, updateUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;
