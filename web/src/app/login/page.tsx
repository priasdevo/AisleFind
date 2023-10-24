'use client'
import TextField from '@/components/textField'
import PasswordTextField from "@/components/passwordTextField";
import './page.scss'
import '@/components/header.scss'
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";
import useLoginForm from "@/app/login/useLoginForm";

export default function Login(){
  const {
    username,
    password,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
  } = useLoginForm();

  return (
    <div className="page-container">

      <div className="title-container">
        <h1>AisleFind</h1>
        <button className="small-button"><AiOutlineSearch/></button>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <h3>เข้าสู่ระบบ</h3>
        <TextField label="Email" variant="outlined" className="field" value={username} onChange={handleUsernameChange} />
        <PasswordTextField label="Password" variant="outlined" className="field" value={password} onChange={handlePasswordChange} />
        <p>ลืมรหัสผ่าน? <Link href="/reset" className="link">รีเซ็ทรหัสผ่าน</Link></p>
        <button className="login-button" type="submit">เข้าสู่ระบบ</button>
        <p>ยังไม่มีบัญชี? <Link href="/register" className="link">ลงทะเบียน</Link></p>
      </form>
    </div>
  )
}