import React from 'react'

function Footer({color}) {
  return (
    <div className='footer' style={{backgroundColor:color}}>
        <p>&copy; 2024 redact. All rights reserved.</p>
    </div>
  )
}

export default Footer;