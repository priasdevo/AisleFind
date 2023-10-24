'use client'
import { TextField as TextFieldMUI, TextFieldProps, styled } from '@mui/material'
import { FC } from 'react'

const StyledTextField = styled(TextFieldMUI)`
  /* Change the white to any color */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.palette.primary.light} inset !important;
      border-radius: 12px;
  }
  label.Mui-focused {
    color: #000000;
  }
  border: none;
`

const TextField: FC<TextFieldProps> = (props) => {
  return (
    <StyledTextField
      fullWidth
      variant="filled"
      style={{
        backgroundColor: '$pi',
        borderRadius: '12px',
      }}
      size="small"
      {...props}
      InputProps={{
        ...props.InputProps,
        sx: {
          borderRadius: '12px',
          backgroundColor: '#21212114',
          '& ::-ms-reveal': {
            display: 'none',
          },
          '& ::-ms-clear': {
            display: 'none',
          },
          ...props.InputProps?.sx,
        },
      }}
      InputLabelProps={{
        sx: {
          color: '#000000',
          ...props.InputLabelProps?.sx,
        },
        ...props.InputLabelProps,
      }}
    />
  )
}

export default TextField