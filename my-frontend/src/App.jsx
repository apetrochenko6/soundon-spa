import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import Navbar from './Navbar';
import Hero from './Hero';
import Bands from './Bands';
import BuyTicket from './BuyTickets';
import Footer from './Footer';
import FAQ from './FAQ';
import LabelSoundon from './Label';
import JoinUs from './JoinUs';
function MainPage() {
  return (
    <>
      <Navbar />
      <LabelSoundon />
      <section id="section"><Hero /></section>
      <section id="zespoly"><Bands /></section>
      <section id="o_nas"><JoinUs /></section>
      <section id="FAQ"><FAQ /></section>
      <Footer />
    </>
  );
}

function TicketPage() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center,rgb(36, 36, 36), #000)',
      }}>
        <BuyTicket />
        <div style={{ marginTop: "180px" }}>
          <div className='divider'></div>
          <Footer />
        </div>
      </div>
    </>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainPage />
        } />
        <Route path="/buy_ticket" element={
          <TicketPage />
        } />
      </Routes>
    </Router>
  );
}
export default App;

