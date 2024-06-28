import React from 'react'
import './NewsLetter.css'

export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get exclusive offers on you Email</h1>
        <p>Subcribe to our newsletter and stay updated</p>
        <div>
            <input type="email" placeholder='Tu Email' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}
