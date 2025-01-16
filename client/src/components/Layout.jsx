import React from 'react'
import { Navbar } from './Navbar'
export const Layout = ({children}) => {
  return (
    <React.Fragment>
      <div>
        {children}
      </div>
    </React.Fragment>
  )
}
