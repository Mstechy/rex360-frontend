import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password',
      });
      if (error) throw error;
      setMessage("Password reset link sent! Check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold text-sm">
            <ArrowLeft size={16}/> Back to Login
        </Link>
        <h2 className="text-3xl font-bold text-blue-950 mb-2">Reset Password</h2>
        <p className="text-gray-500 mb-8">Enter your email to receive reset instructions.</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">{message}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition flex justify-center">
            {loading ? <Loader2 className="animate-spin"/> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}