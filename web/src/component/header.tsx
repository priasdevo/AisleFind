import './header.scss'
import { AiOutlineSearch } from 'react-icons/ai'

export default function Header(){
  return (
    <div className="header-container">
      <h2>AisleFind</h2>
      <button className="search"><AiOutlineSearch/></button>
      <button className="search"><AiOutlineSearch/></button>
    </div>
  )
}