import './header.scss'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdLogout } from 'react-icons/md'
import { Typography } from "@mui/material";

export default function Header(){
  return (
    <div className="header-container">
      <h2>AisleFind</h2>
      <button className="small-button"><AiOutlineSearch/></button>

      <button className="button">
        <p>
          รายชื่อร้านค้า
        </p>
      </button>
      <button className="small-button"><MdLogout/></button>
    </div>
  )
}