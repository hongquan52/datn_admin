import React, { useState } from 'react'
import RightSide from '../components/RigtSide/RightSide'
import Sidebar from '../components/Sidebar';
import {BrowserRouter } from 'react-router-dom'
import Routers from '../routes/Routers';


const y = sessionStorage.getItem('accessToken');

const Layout = () => {
    
    return (
        <BrowserRouter>
            {y ? <Sidebar/> :<div></div>}
            <Routers />
            { y ? <RightSide/>: <div></div>}
        </BrowserRouter>
    )
}

export default Layout