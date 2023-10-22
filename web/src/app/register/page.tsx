import TextField from '@/components/textField'
import PasswordTextField from "@/components/passwordTextField";
import '../login/page.scss'
import '@/components/header.scss'
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";

export default function Register(){
  return (
    <div className="page-container">

      <div className="title-container">
        <h1>AisleFind</h1>
        <button className="small-button"><AiOutlineSearch/></button>
      </div>

      <div className="form-container">
        <h3>ลงทะเบียน</h3>
        <TextField label="Email" variant="outlined" className="field" />
        <PasswordTextField label="Password" variant="outlined" className="field" />
        <PasswordTextField label="Confirm password" variant="outlined" className="field" />
        <button className="login-button">ลงทะเบียน</button>
        <p>มีบัญชีแล้ว? <Link href="/login" className="link">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  )
}