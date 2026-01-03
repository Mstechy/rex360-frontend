import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- CORE COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; 
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// --- PAGES (PRO-MEASURE: IMPLEMENTING LAZY LOADING FOR SPEED) ---
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login')); 
const Signup = lazy(() => import('./pages/Signup')); 
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const Checkout = lazy(() => import('./pages/Checkout')); 
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

function App() {
  const location = useLocation();

  // Hide Navbar/Footer on Admin for a "True Command Center" Feel
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-green-600 selection:text-white">
      <ScrollToTop />
      
      {/* 1. DYNAMIC NAVIGATION GUARD */}
      {!isAdminPath && <Navbar />}
      
      <main className="flex-grow overflow-x-hidden">
        <ErrorBoundary>
          {/* 2. FLOW ANIMATION WRAPPER */}
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* --- PUBLIC NODES --- */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<PostDetails />} />
                
                {/* --- AUTHENTICATION NODES --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                
                {/* --- TRANSACTION NODES --- */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                {/* --- SECURE COMMAND NODE --- */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />

                {/* --- 404 FALLBACK --- */}
                <Route path="*" element={
                  <div className="h-screen flex flex-col items-center justify-center">
                    <h1 className="text-9xl font-black text-slate-100">404</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest -mt-10">Resource Offline</p>
                    <a href="/" className="mt-8 text-green-600 font-black border-b-2 border-green-600">Return to Grid</a>
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;