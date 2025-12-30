import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // This connects to your supabase.js

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session immediately 
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    // Listen for login/logout events (The "Pro" method)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Verifying Security...</div>;

  // If no user is logged in, they are blocked from seeing 'children' (Admin)
  return session ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
