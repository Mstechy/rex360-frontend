import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; 
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import PostDetails from './pages/PostDetails';
import Admin from './pages/Admin';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Checkout from './pages/Checkout'; 

function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <ScrollToTop />
      
      <Navbar />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
          {/* PUBLIC PAGES - Accessible to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<PostDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* SECURE ADMIN PAGE - ONLY accessible with a password */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          </Route>
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;