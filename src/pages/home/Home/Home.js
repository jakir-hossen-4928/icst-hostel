import React from 'react'
import Herrobanner from '../herobanner/Herrobanner'
import About from '../about/About'
import Question from '../Questionpart/Question'
import Contact from '../contact/Contact'
import FileUploadComponent from '../../../dashboard/managmentcosts/FileUploadComponent'



const Home = () => {
  return (
    <div>
        <Herrobanner></Herrobanner>
        <About></About>
        <Question></Question>
        <Contact></Contact>
    </div>
  )
}

export default Home