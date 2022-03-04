import React from 'react'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
export default function Header() {
  return (
    <div className='Header'>
        <div className='Header-title '>AIR DROP</div>
        <Button variant="danger" className='Connect-btn'>Connect</Button>
    </div>
  )
}
