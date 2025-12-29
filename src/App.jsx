import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // The new scrolling fix

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import PostDetails from './pages/PostDetails';
import Admin from './pages/Admin';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import ForgotPassword from './pages/ForgotPassword'; 
import Checkout from './pages/Checkout'; 

function App() {
  return (
    <Router>
      {/* Triggers scroll to top on page change */}
      <ScrollToTop />
      
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Navbar />
        
        {/* flex-grow pushes the footer to the bottom */}
        <main className="flex-grow">
          <Routes>
            {/* PUBLIC PAGES */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<PostDetails />} />
            
            {/* ADMIN & AUTH */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* PAYMENT PAGE */}
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;