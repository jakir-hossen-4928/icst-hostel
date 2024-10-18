import React from 'react'
import Footer from '../../shared/footer/Footer';
import Navbar from '../../shared/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const Main = () => {
  return (
    <div>
      <Navbar></Navbar>
       <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}

export default Main