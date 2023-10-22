import TextField from '@/components/textField'
import PasswordTextField from "@/components/passwordTextField";
import './page.scss'
import '@/components/header.scss'
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";

export default function Login(){
  return (
    <div className="page-container">

      <div className="title-container">
        <h1>AisleFind</h1>
        <button className="small-button"><AiOutlineSearch/></button>
      </div>

      <div className="form-container">
        <h3>เข้าสู่ระบบ</h3>
        <TextField label="Email" variant="outlined" className="field" />
        <PasswordTextField label="Password" variant="outlined" className="field" />
        <p>ลืมรหัสผ่าน? <Link href="/reset" className="link">รีเซ็ทรหัสผ่าน</Link></p>
        <button className="login-button">เข้าสู่ระบบ</button>
        <p>ยังไม่มีบัญชี? <Link href="/register" className="link">ลงทะเบียน</Link></p>
      </div>
    </div>
  )
}