import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#E3E3E3] font-['Public_Sans',sans-serif]">
        <div className="flex gap-4 mb-6">
          <div className="h-12 w-12 animate-bounce bg-[#1B3C53] rounded-full"></div>
          <div className="h-12 w-12 animate-bounce bg-[#1B3C53] rounded-full [animation-delay:-.3s]"></div>
          <div className="h-12 w-12 animate-bounce bg-[#1B3C53] rounded-full [animation-delay:-.5s]"></div>
        </div>
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-2">Preparing Your Pet Care Experience</h2>
        <p className="text-[#456882]">Loading your dashboard securely via Supabase...</p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     SIGN UP PAGE
  ───────────────────────────────────────────── */
  if (isSignUp) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-0 md:p-4"
        style={{ backgroundColor: '#f8f6f6', fontFamily: "'Public Sans', sans-serif" }}
      >
        <div className="flex w-full max-w-[1200px] min-h-[800px] bg-white shadow-2xl overflow-hidden rounded-xl">

          {/* Left Side: Branding */}
          <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center p-12 overflow-hidden" style={{ backgroundColor: '#1B3C53' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #456882, #1B3C53)' }}></div>
            <div className="relative z-10 w-full max-w-md">
              <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center" style={{ color: '#1B3C53' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>pets</span>
                </div>
                <span className="text-white text-2xl font-bold tracking-tight">Zootopia</span>
              </div>

              <h1 className="text-white text-5xl font-black leading-tight mb-6">
                Professional Care for Your Best Friends.
              </h1>
              <p className="text-slate-200 text-lg mb-10 leading-relaxed">
                Join our community of animal lovers and professional caregivers. Manage your pets, track health records, and connect with experts.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}>
                  <span className="material-symbols-outlined text-white mb-2 block">medical_services</span>
                  <p className="text-white font-semibold">Health Tracking</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}>
                  <span className="material-symbols-outlined text-white mb-2 block">calendar_month</span>
                  <p className="text-white font-semibold">Easy Scheduling</p>
                </div>
              </div>
            </div>

            {/* Decorative circle */}
            <div className="absolute bottom-[-10%] right-[-10%] w-2/3 h-2/3 opacity-30 pointer-events-none">
              <div
                className="w-full h-full bg-cover bg-no-repeat rounded-full"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA9YU5BuhHMjIJuIBhzXs9wtu_a67t-GFI_0fxe8x5f8VYqnVxKV6UDZytqakieXDPgjxNA1QqoHfAvNbxmH5tRHorJ3oMwXF9uXvcTl7RuWtDTmnpmzl-FKcVcLeazPaORWfEe0-_OHKFJgDIIo_96qLdDEDyqyWxC0M5MmPwtCGeZHkOe0OQOsLfKP09bI_X9rvV6hw_YxYEMUBHcx3Fnv2aJrMbUhYA1RdPRWEhd-mNP15bCAkPeWDc8bMb11AhviobwiPV5Jo')" }}
              ></div>
            </div>
          </div>

          {/* Right Side: Sign-Up Form */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-white">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-10">
                <h2 className="text-slate-900 text-3xl font-bold mb-2">Create your account</h2>
                <p className="text-slate-500">Enter your details to get started with Zootopia Animal Care.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                      style={{ '--tw-ring-color': '#1B3C53' }}
                      onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      placeholder="John"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                      onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      placeholder="Doe"
                      type="text"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Username</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                      onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      placeholder="johndoe123"
                      type="text"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                      onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                      placeholder="email@example.com"
                      type="email"
                    />
                  </div>
                </div>

                {/* Password + Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                        onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        placeholder="••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Confirm Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none transition-all placeholder-slate-400"
                        onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                        placeholder="••••••••"
                        type="password"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 pt-2">
                  <input className="w-4 h-4 rounded border-slate-300" id="terms" type="checkbox" />
                  <label className="text-sm text-slate-600" htmlFor="terms">
                    I agree to the{' '}
                    <a className="font-semibold hover:underline" href="#" style={{ color: '#1B3C53' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a className="font-semibold hover:underline" href="#" style={{ color: '#1B3C53' }}>Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-bold py-4 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ backgroundColor: isLoading ? '#234C6A' : '#1B3C53', boxShadow: '0 10px 15px -3px rgba(27,60,83,0.2)' }}
                  onMouseEnter={e => { if (!isLoading) e.target.style.backgroundColor = '#234C6A'; }}
                  onMouseLeave={e => { if (!isLoading) e.target.style.backgroundColor = '#1B3C53'; }}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <button
                    onClick={handleToggleForm}
                    className="font-bold hover:underline"
                    style={{ color: '#1B3C53' }}
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     LOGIN PAGE
  ───────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: '#E3E3E3', fontFamily: "'Public Sans', sans-serif" }}
    >
      <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold" style={{ color: '#1B3C53' }}>Login</h1>
            <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#1B3C53' }}>Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#456882' }}>mail</span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all text-slate-900 placeholder-slate-400"
                  onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  placeholder="name@company.com"
                  type="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold" style={{ color: '#1B3C53' }}>Password</label>
                <a className="text-xs font-medium transition-colors hover:underline" href="#" style={{ color: '#456882' }}>Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#456882' }}>lock</span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all text-slate-900 placeholder-slate-400"
                  onFocus={e => { e.target.style.borderColor = '#1B3C53'; e.target.style.boxShadow = '0 0 0 2px rgba(27,60,83,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input className="rounded border-slate-300" id="remember" type="checkbox" />
              <label className="text-sm text-slate-600" htmlFor="remember">Remember for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3.5 rounded-lg transition-colors tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: isLoading ? '#1B3C53' : '#234C6A', boxShadow: '0 10px 15px -3px rgba(27,60,83,0.2)' }}
              onMouseEnter={e => { if (!isLoading) e.target.style.backgroundColor = '#1B3C53'; }}
              onMouseLeave={e => { if (!isLoading) e.target.style.backgroundColor = '#234C6A'; }}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={handleToggleForm}
                className="font-bold hover:underline"
                style={{ color: '#1B3C53' }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Right Side: Branding */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden"
          style={{ backgroundColor: '#1B3C53' }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-16 -mb-16" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          ></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="p-6 rounded-full mb-8 border" style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: '80px' }}>pets</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">ZOOTOPIA</h2>
            <p className="text-xl font-light uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.80)' }}>Animal Care</p>
            <div className="mt-12 max-w-xs">
              <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.60)' }}>
                "Professional care for every creature, great and small. Dedicated to the well-being of your animal companions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
