import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        
        <h2 className="text-3xl font-bold text-blue-950 mb-2">Update Password</h2>
        <p className="text-gray-500 mb-8">Create a new secure password for your account.</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">Password updated successfully! Redirecting to login...</div>}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                required 
                className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition flex justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
