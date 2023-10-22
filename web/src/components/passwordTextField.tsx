'use client'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { IconButton, InputAdornment, TextFieldProps } from '@mui/material'
import { useShowPassword } from '@/hooks/useShowPassword'
import { FC } from 'react'

import TextField from './textField'

const PasswordTextField: FC<TextFieldProps> = (props) => {
  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useShowPassword()

  return (
    <TextField
      type={!showPassword ? 'password' : 'text'}
      label="password"
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              style={{ color: '#FCA86C' }}
            >
              {!showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </IconButton>
          </InputAdornment>
        ),
        ...props.InputProps,
      }}

    />
  )
}

export default PasswordTextField