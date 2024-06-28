import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

export const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt=''/>
            <p>LUVA INDUMENTARIA</p>
        </div>
        <ul className="footer-links">
            <li>Empresa</li>
            <li>Productos</li>
            <li>Oficinas</li>
            <li>Acerca de</li>
            <li>Contacto</li>
        </ul>
        <div className="footer-social-icon">
          <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
          </div>
          <div className="footer-icons-container">
            <img src={pintester_icon} alt="" />
          </div>
          <div className="footer-icons-container">
            <img src={whatsapp_icon} alt="" />
          </div>
        </div>
        <div className="footer-copyright">
          <hr/>
          <p>Copyright @ 2024 - Todos los derechos reservados</p>
        </div>
    </div>
  )
}
