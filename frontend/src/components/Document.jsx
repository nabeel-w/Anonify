import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Files from './Files'

function Document() {
  return (
    <div className="document background">
        <Navbar notHome={"notHome"}/>
        <Files/>
        <Footer/>
    </div>
  )
}

export default Document