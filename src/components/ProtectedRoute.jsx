import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ADMIN_EMAIL = 'rex360solutions@gmail.com'; // Only this email can access admin

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check for an active session immediately 
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setSession(null);
          setUser(null);
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        setSession(session);
        
        // Get the user's email from the session
        const userEmail = session?.user?.email;
        setUser(session?.user);

        // Check if this is the admin
        if (userEmail === ADMIN_EMAIL) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setSession(null);
        setUser(null);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setSession(null);
        setUser(null);
        setIsAuthorized(false);
      } else {
        setSession(session);
        setUser(session.user);
        setIsAuthorized(session.user?.email === ADMIN_EMAIL);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center font-bold">
        <div className="animate-spin text-blue-600 mb-4">⏳</div>
        Verifying Security...
      </div>
    );
  }

  // Block access if not logged in or not admin
  if (!session || !isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
