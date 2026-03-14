import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.username) {
      throw new Error("All fields are required for registration.");
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords do not match!");
    }
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        throw new Error("Registration failed: User with this email already exists.");
      }
      throw signUpError;
    }

    const { error: insertError } = await supabase
      .from('zootopiaDatabase')
      .insert([
        { 
          username: formData.username, 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          email: formData.email,
          role: 'user'
        }
      ]);

    if (insertError) throw new Error("Account created but profile save failed: " + insertError.message);
    return authData;
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      throw new Error("Email and Password are required for login.");
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        throw new Error("Login failed: Invalid email or password.");
      }
      throw signInError;
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        await handleSignUp();
        setIsLoading(false);
        setSuccessMsg("Registration successful! Entering Dashboard...");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        await handleLogin();
        setIsLoading(false);
        setIsLoadingPage(true);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
    setSuccessMsg('');
  };

  if (isLoadingPage) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark font-display">
        <div className="flex gap-4 mb-6">
          <div className="h-12 w-12 animate-bounce bg-primary rounded-full"></div>
          <div className="h-12 w-12 animate-bounce bg-primary rounded-full [animation-delay:-.3s]"></div>
          <div className="h-12 w-12 animate-bounce bg-primary rounded-full [animation-delay:-.5s]"></div>
        </div>
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2">Preparing Your Pet Care Experience</h2>
        <p className="text-brand-light dark:text-brand-soft">Loading your dashboard securely via Supabase...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-6 relative overflow-hidden">
      {/* Background paw decorations */}
      <span className="material-symbols-outlined absolute -top-10 -left-10 text-[200px] text-primary/5 rotate-12 select-none">pets</span>
      <span className="material-symbols-outlined absolute -bottom-20 -right-20 text-[300px] text-primary/5 -rotate-12 select-none">pets</span>
      
      <div className="w-full max-w-[1000px] bg-white dark:bg-brand-dark rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* Left Side: Branding/Image */}
        <div className="w-full md:w-1/2 bg-brand-medium p-12 flex flex-col justify-center items-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-5xl">pets</span>
            <h1 className="text-4xl font-black tracking-tight">Zootopia</h1>
          </div>
          
          <div className="text-center space-y-4 max-w-sm">
            <h2 className="text-2xl font-bold">Your Pet's Happy Place</h2>
            <p className="text-brand-soft leading-relaxed">
              Professional and compassionate animal care services tailored to your pet's unique needs.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-4 w-full opacity-50">
             <div className="h-1 bg-white/20 rounded-full"></div>
             <div className="h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-brand-dark">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-brand-dark dark:text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-brand-light dark:text-brand-soft">
                {isSignUp ? 'Join the Zootopia community today' : 'Log in to manage your pets'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded shadow-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">Username</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-light text-xl">person</span>
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Choose a username"
                        type="text"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="First name"
                        type="text"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Last name"
                        type="text"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-light text-xl">mail</span>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="example@mail.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-light text-xl">lock</span>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark dark:text-brand-soft uppercase tracking-wider pl-1">Confirm Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-light text-xl">lock_reset</span>
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Free Account' : 'Sign In to Account'}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 text-center">
              <p className="text-brand-light dark:text-brand-soft">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={handleToggleForm}
                  className="ml-2 text-primary font-bold hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Register Now'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
