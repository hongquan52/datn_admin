import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../imgs/profile.png'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
const Sidebar = () => {
  const userName = sessionStorage.getItem('userName')
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const [expanded, setExpaned] = useState(true)
  const [open, setOpen] = React.useState(false);
  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
  console.log(window.innerWidth)
  const logoutHandle = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userID');
    navigate('/login');
    window.location.reload();
  }
  return (
    <>
      <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpaned(!expanded)}>
        <UilBars />
      </div>
    <motion.div className='sidebar'
    variants={sidebarVariants}
    animate={window.innerWidth<=768?`${expanded}`:''}
    >
      {/* logo */}
      <div className="logo">
        <img src={Logo} alt="logo" />
        <span>
          QLStore
        </span>
      </div>
      <div className="sidebar__info-container">
        <img src={avatar} style={{height: 40, width: 40, borderRadius: 20, marginRight: 5}} onClick={() => setOpen(!open)}/>
        <h5 >{userName}</h5>
        {
          open && (
            <div className="sidebar__info-item">
              <div className="sidebar__info-detail">
                <AccountBoxIcon fontSize="13px" />
                <p>Profile</p>
              </div>
              <div className="sidebar__info-detail" onClick={() => logoutHandle()}>
                <LogoutIcon fontSize="13px" />
                <p>Logout</p>
              </div>
            </div>
          )
        }
      </div>
      <div className="menu">
        {SidebarData.map((item, index) => {
          return (
             
              <div
                
                className={selected === index ? "menuItem active" : "menuItem"}
                key={index}
                onClick={() => {
                  setSelected(index);
                  navigate(item.path)
                }}
              >
                <item.icon />
                <span>{item.heading}</span>
              </div>
            
          );
        })}
        {/* signoutIcon */}
        <div className="menuItem">
          <UilSignOutAlt />
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Sidebar;

