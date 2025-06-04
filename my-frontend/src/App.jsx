import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Navbar'
import Hero from './Hero'
import Bands from './Bands'
import BuyTicket from './BuyTickets'
import Footer from './Footer';
import FAQ from './FAQ'
import LabelSoundon from './Label'
function App() {

  return <>

    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <LabelSoundon/>
            <section id="section"><Hero id="section"/>
            </section>
            <section id="zespoly"><Bands /></section>
            
             <section id="FAQ"><FAQ/></section>
             
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
