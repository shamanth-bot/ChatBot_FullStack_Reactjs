import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Landing from './pages/Landing';
import About from './pages/About';
import shop from './shop/shop';
import FAQS from './pages/FAQS';
import Botchat from './chatbot/Botchat'

const App = () => (
    <div>
       <BrowserRouter>
           <div className="container"> 
               <Header />
               <Route exact path="/" component={Landing} />
               <Route exact path="/FAQS" component={FAQS} />
               <Botchat/>   

           </div>
       </BrowserRouter>
    </div>
)

export default App;
