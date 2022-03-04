import React from 'react'
import { Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
export default function Claim() {
  return (
    <div className='Body-content'>
        
        <Button className='Main-btn' variant="success">Claim</Button>
        <div className='Amount-text'>Your current amount: 100NDT</div>
    </div>
  )
}
