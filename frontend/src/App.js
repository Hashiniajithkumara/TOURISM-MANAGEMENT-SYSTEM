import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Homepage.js';
import BookingsForm from './pages/EventBookingForm';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingsForm />} />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;