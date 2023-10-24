"use client"
import React, {createContext, useContext, useEffect, useState} from 'react'
import {IUserContext} from './types'

const UserContext = createContext<IUserContext>({} as IUserContext)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({children}: React.PropsWithChildren<{}>) => {
  const [email, setEmail] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');

    const validateToken = async () => {
      try {
        const res = await fetch(process.env['NEXT_PUBLIC_GATEWAY_URL'] + '/user/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        const data = await res.json();
        console.log("data: ",data)
        if(data.success) {
          setEmail(data.username);
          setIsLogin(true);
          setUserId(data.id)
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    if(token)
      validateToken();
  }, [])

  const logout = () => {
    localStorage.removeItem('token');
    setEmail('');
    setUserId('');
    setIsLogin(false);
  }

  return (
    <UserContext.Provider value={{email, isLogin, userId, logout}}>
      {children}
    </UserContext.Provider>
  )
}