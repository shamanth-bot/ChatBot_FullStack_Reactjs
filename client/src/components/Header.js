import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <nav>

           <div className="nav-wrapper purple darken-4">
            <Link to={'/'} className="brand-logo">INTERACTIVE CHATBOT</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to={'/FAQS'}>FAQS</Link></li>

            </ul>
        </div>
    </nav>
)

export default Header;