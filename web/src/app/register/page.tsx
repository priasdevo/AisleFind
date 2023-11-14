"use client";
import TextField from "@/components/textField";
import PasswordTextField from "@/components/passwordTextField";
import "../login/page.scss";
import "@/components/header.scss";
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";
import useRegisterForm from "@/app/register/useRegisterForm";
import { MenuItem } from "@mui/material";

export default function Register() {
  const {
    username,
    password,
    conFirmPassword,
    role,
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleConFirmPasswordChange,
    handleRoleChange,
  } = useRegisterForm();

  return (
    <div className="page-container">
      <div className="title-container">
        <h1>AisleFind</h1>
        <button className="small-button">
          <AiOutlineSearch />
        </button>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <h3>ลงทะเบียน</h3>
        <TextField
          label="Email"
          variant="outlined"
          className="field"
          value={username}
          onChange={handleUsernameChange}
        />
        <PasswordTextField
          label="Password"
          variant="outlined"
          className="field"
          value={password}
          onChange={handlePasswordChange}
        />
        <PasswordTextField
          label="Confirm password"
          variant="outlined"
          className="field"
          value={conFirmPassword}
          onChange={handleConFirmPasswordChange}
        />

        <TextField
          label="Role"
          variant="outlined"
          className="field"
          value={role}
          select // tell TextField to render select
          onChange={handleRoleChange}
        >
          <MenuItem key={1} value="customer">
            Customer
          </MenuItem>
          <MenuItem key={2} value="owner">
            Owner
          </MenuItem>
        </TextField>
        <button className="login-button" type="submit">
          ลงทะเบียน
        </button>
        <p>
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="link">
            เข้าสู่ระบบ
          </Link>
        </p>
      </form>
    </div>
  );
}
