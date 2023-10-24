import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSnackbar } from "@/context/snackbarContext";
import {useUser} from "@/context/userContext";

const useRegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [conFirmPassword, setConFirmPassword] = useState('')
  const { displaySnackbar } = useSnackbar();
  const { setIsLogin, setEmail } = useUser();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username.trim() === '') {
      displaySnackbar('Username is required', 'error')
      return;
    }
    if (password.trim() === '') {
      displaySnackbar('Password is required', 'error')
      return;
    }
    if (password.trim() !== conFirmPassword.trim()) {
      displaySnackbar('Password is not match', 'error')
      return;
    }
    try {
      const req = {
        username: username,
        password: password,
        role: "owner"
      }
      const res = await fetch(process.env["NEXT_PUBLIC_GATEWAY_URL"] + '/user/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
      })

      const data = await res.json();

      if (!data.success) {
        displaySnackbar('This username is already taken', 'error');
      } else {
        router.push('/')
        localStorage.setItem('token', data.token)
        setIsLogin(true)
        setEmail(username)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConFirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConFirmPassword(event.target.value)
  }

  return {
    username,
    password,
    conFirmPassword,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleConFirmPasswordChange,
  }

}

export default useRegisterForm
