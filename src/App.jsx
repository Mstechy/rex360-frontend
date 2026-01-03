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

// --- NEW COMPREHENSIVE NODES ---
const Onboarding = lazy(() => import('./pages/Onboarding'));
const About = lazy(() => import('./pages/About'));

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
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-slate-950">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing REX360</span>
              </div>
            </div>
          }>
            {/* 2. FLOW ANIMATION WRAPPER */}
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* --- PUBLIC NODES --- */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<PostDetails />} />
                <Route path="/about" element={<About />} />
                
                {/* --- AUTHENTICATION NODES --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                
                {/* --- TRANSACTION & ONBOARDING NODES --- */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
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
                  <div className="h-screen flex flex-col items-center justify-center bg-white">
                    <h1 className="text-[12rem] font-black text-slate-100 leading-none">404</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest -mt-10">Resource Offline</p>
                    <a href="/" className="mt-12 px-8 py-4 bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-green-600 transition-colors">
                      Return to Command Center
                    </a>
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