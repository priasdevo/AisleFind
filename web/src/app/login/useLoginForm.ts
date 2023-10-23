import router from 'next/router'
import React, { useState } from 'react'
import { useSnackbar } from "@/context/snackbarContext";

const useLoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { displaySnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username.trim() === '') {
      displaySnackbar('Username is required', 'error')
    }
    if (password.trim() === '') {
      displaySnackbar('Password is required', 'error')
    }
      try {
        const req = {
          username: username,
          password: password,
        }
        const res = await fetch(process.env["NEXT_PUBLIC_USER_URL"] + '/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req)
        })

        const data = await res.json();

        if (!data.isSuccess) {
          displaySnackbar('This username is already taken', 'error');
        } else {
          await router.push('/')
          localStorage.setItem('token', data.token)
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

  return {
    username,
    password,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
  }

}

export default useLoginForm