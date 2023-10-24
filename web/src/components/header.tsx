"use client";
import './header.scss'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdLogout, MdOutlineStorefront } from 'react-icons/md'
import { useUser } from "@/context/userContext";
import Link from "next/link";

export default function Header(){

  const { isLogin, logout } = useUser();

  return (
    <div className="header-container">
      <h2>AisleFind</h2>
      <button className="small-button"><AiOutlineSearch/></button>

      {isLogin ? (
        <>
          <div style={{marginLeft:'auto'}}></div>
          <button className="button">
            <p>รายชื่อร้านค้า</p>
          </button>
          <button className="small-button" onClick={logout}><MdLogout/></button>
        </>
      ):
        <>
          <div style={{marginLeft:'auto'}}></div>
          <button className="small-button">
            <Link href={'/login'}>
              <MdOutlineStorefront/>
            </Link>
          </button>
        </>
      }
    </div>
  )
}