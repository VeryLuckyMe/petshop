import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthPresenter } from '../Presenter/AuthPresenter';

function AuthView() {
  const navigate = useNavigate();
  const {
    isSignUp, isLoading, isLoadingPage, showPassword, error, successMsg, formData, agreeTerms,
    handleToggleForm, handleChange, handleSubmit, setShowPassword, setAgreeTerms
  } = useAuthPresenter(navigate);

  if (isLoadingPage) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8f6f6] font-display">
        <div className="flex gap-4 mb-6">
          <div className="h-10 w-10 bg-[#1B3C53] rounded-full paw-bounce-item" style={{ animationDelay: '0s' }}></div>
          <div className="h-10 w-10 bg-[#ec5b13] rounded-full paw-bounce-item" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-10 w-10 bg-[#456882] rounded-full paw-bounce-item" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <h2 className="text-xl font-black text-[#1B3C53] tracking-tight mb-1 font-['Outfit',sans-serif]">Preparing Your Pet Care Experience</h2>
        <p className="text-sm text-[#456882]">Loading your dashboard securely via Supabase...</p>
      </div>
    );
  }

  if (isSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 ambient-bg font-display">
        <div className="flex w-full max-w-[1100px] min-h-[750px] bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden rounded-3xl">
          {/* Left Editorial Banner */}
          <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden bg-[#1B3C53]">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 20%, #456882 0%, #1B3C53 80%)' }}></div>
            <div className="relative z-10">
              <div className="mb-12 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1B3C53]">
                  <span className="material-symbols-outlined text-xl">pets</span>
                </div>
                <span className="text-white text-xl font-black tracking-tight font-['Outfit',sans-serif]">Zootopia</span>
              </div>
              <h1 className="text-white text-5xl font-black leading-tight mb-6 font-['Outfit',sans-serif]">Professional Care for Your Best Friends.</h1>
              <p className="text-slate-200 text-base leading-relaxed max-w-sm">Join our exclusive community of animal lovers and certified veterinary experts today.</p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-white mb-2 block">medical_services</span>
                <p className="text-white text-sm font-bold tracking-wide">Health Tracking</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="material-symbols-outlined text-white mb-2 block">calendar_month</span>
                <p className="text-white text-sm font-bold tracking-wide">Easy Scheduling</p>
              </div>
            </div>
          </div>
          
          {/* Right Form Card */}
          <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-[#1B3C53] text-3xl font-black tracking-tight font-['Outfit',sans-serif]">Create an Account</h2>
                <p className="text-slate-500 text-sm mt-1">Get started with Zootopia pet care ecosystem.</p>
              </div>
              {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl flex items-center gap-3"><span className="material-symbols-outlined text-lg">error</span>{error}</div>}
              {successMsg && <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs rounded-xl flex items-center gap-3"><span className="material-symbols-outlined text-lg">check_circle</span>{successMsg}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 focus-line-container">
                    <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="John" type="text" />
                    <span className="focus-line-bar"></span>
                  </div>
                  <div className="flex flex-col gap-1.5 focus-line-container">
                    <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="Doe" type="text" />
                    <span className="focus-line-bar"></span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 focus-line-container">
                  <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Username</label>
                  <input name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="john_doe" type="text" />
                  <span className="focus-line-bar"></span>
                </div>
                <div className="flex flex-col gap-1.5 focus-line-container">
                  <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="john@example.com" type="email" />
                  <span className="focus-line-bar"></span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 focus-line-container">
                    <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Password</label>
                    <input name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="••••••••" type="password" />
                    <span className="focus-line-bar"></span>
                  </div>
                  <div className="flex flex-col gap-1.5 focus-line-container">
                    <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Confirm</label>
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="••••••••" type="password" />
                    <span className="focus-line-bar"></span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 mt-3 select-none">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13] cursor-pointer mt-0.5"
                  />
                  <label htmlFor="agreeTerms" className="text-slate-500 text-xs cursor-pointer leading-relaxed">
                    I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="underline font-bold text-[#1B3C53] hover:text-[#ec5b13]">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="underline font-bold text-[#1B3C53] hover:text-[#ec5b13]">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" disabled={isLoading} className="w-full text-white font-extrabold py-3.5 rounded-full mt-4 disabled:opacity-70 bg-[#1B3C53] hover:bg-[#ec5b13] transition-all duration-300 shadow-md uppercase tracking-wider text-xs" style={{ minHeight: '46px' }}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-xs">Already have an account? <button onClick={handleToggleForm} className="font-extrabold text-[#1B3C53] hover:text-[#ec5b13] underline ml-1">Log in</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 ambient-bg font-display">
      <div className="max-w-[900px] w-full bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Left Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1B3C53] tracking-tight font-['Outfit',sans-serif]">Login</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back to Zootopia care panel.</p>
          </div>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-xl border-l-4 border-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5 focus-line-container">
              <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Email Address</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="email@example.com" type="email" />
              <span className="focus-line-bar"></span>
            </div>
            <div className="flex flex-col gap-1.5 focus-line-container">
              <label className="text-[#1B3C53] text-xs font-bold uppercase tracking-wider">Password</label>
              <input name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 outline-none text-sm transition-all focus:bg-white" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
              <span className="focus-line-bar"></span>
            </div>
            <button type="submit" disabled={isLoading} className="w-full text-white font-extrabold py-3.5 rounded-full bg-[#1B3C53] hover:bg-[#ec5b13] transition-all duration-300 shadow-md uppercase tracking-wider text-xs mt-2" style={{ minHeight: '46px' }}>
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs">Don't have an account? <button onClick={handleToggleForm} className="font-extrabold text-[#1B3C53] hover:text-[#ec5b13] underline ml-1">Sign Up</button></p>
          </div>
        </div>
        
        {/* Right Side Brand Banner */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden bg-[#1B3C53]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #456882 0%, #1B3C53 100%)' }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#1B3C53] mb-6 shadow-xl">
              <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>pets</span>
            </div>
            <h2 className="text-3xl font-black tracking-widest uppercase font-['Outfit',sans-serif]">ZOOTOPIA</h2>
            <p className="text-xs italic opacity-60 mt-16 max-w-[200px]">"Professional care for every creature, great and small."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthView;

