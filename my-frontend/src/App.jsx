import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './navbar'
import Hero from './Hero'
import Bands from './bands'
import BuyTicket from './BuyTickets'
import Footer from './Footer';
import FAQ from './FAQ'
function App() {

  return <>

    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <Bands />
             <FAQ/>
            <Footer/>
           
          </>
        } />
        <Route path="/buy_ticket" element={
          <>
            <Navbar />
            <div style={{
              minHeight: '100vh',
                background: 'linear-gradient(to right, #000000, #434343)', 
            
            }}>

              <BuyTicket />
             
            </div>

          </>
        } />
      </Routes>
    </Router>
  </>
}

export default App
