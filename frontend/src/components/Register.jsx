import React from 'react'
import { Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
export default function Register() {
  return (
    <div className='Body-content'>
        
        <Button className='Main-btn' variant="success">Register</Button>
        <div className='Random-amount'>Random 1-100 tokens</div>
        <div className='Amount-text'>Your current amount: 100NDT</div>
    </div>
  )
}
