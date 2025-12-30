import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ADMIN_EMAIL = 'rex360solutions@gmail.com'; // Only this email can access admin

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    isAuthorized: false,
    session: null,
    user: null,
  });

  useEffect(() => {
    // Verify authentication immediately
    const verifyAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            isAuthorized: false,
            session: null,
            user: null,
          });
          return;
        }

        // Check if session exists and user is the admin
        if (session && session.user?.email === ADMIN_EMAIL) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: true,
            session,
            user: session.user,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: !!session,
            isAuthorized: false,
            session,
            user: session?.user || null,
          });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          isAuthorized: false,
          session: null,
          user: null,
        });
      }
    };

    verifyAuth();

    // Set up real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            isAuthorized: false,
            session: null,
            user: null,
          });
        } else if (session.user?.email === ADMIN_EMAIL) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: true,
            session,
            user: session.user,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: false,
            session,
            user: session.user,
          });
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 🔒 SECURITY: While loading, show nothing to prevent flash of content
  if (authState.isLoading) {
    return (
      <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-blue-600 mb-4 text-4xl">⏳</div>
          <p className="font-bold text-gray-700">Verifying Security...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  // 🔒 SECURITY: If not authenticated or not admin, redirect to login
  if (!authState.isAuthenticated || !authState.isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Only render children if fully authenticated and authorized
  return children;
};

export default ProtectedRoute;
