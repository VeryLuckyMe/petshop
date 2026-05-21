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

  if (isSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-0 md:p-4" style={{ backgroundColor: '#f8f6f6', fontFamily: "'Public Sans', sans-serif" }}>
        <div className="flex w-full max-w-[1200px] min-h-[800px] bg-white shadow-2xl overflow-hidden rounded-xl">
          <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center p-12 overflow-hidden" style={{ backgroundColor: '#1B3C53' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #456882, #1B3C53)' }}></div>
            <div className="relative z-10 w-full max-w-md">
              <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center" style={{ color: '#1B3C53' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>pets</span>
                </div>
                <span className="text-white text-2xl font-bold tracking-tight">Zootopia</span>
              </div>
              <h1 className="text-white text-5xl font-black leading-tight mb-6">Professional Care for Your Best Friends.</h1>
              <p className="text-slate-200 text-lg mb-10 leading-relaxed">Join our community of animal lovers and professional caregivers.</p>
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
          </div>
          <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-white">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-10">
                <h2 className="text-slate-900 text-3xl font-bold mb-2">Create your account</h2>
                <p className="text-slate-500">Enter your details to get started with Zootopia.</p>
              </div>
              {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-3"><span className="material-symbols-outlined text-lg">error</span>{error}</div>}
              {successMsg && <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded flex items-center gap-3"><span className="material-symbols-outlined text-lg">check_circle</span>{successMsg}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="John" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="Doe" type="text" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Username</label>
                  <input name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="username" type="text" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="email@example.com" type="email" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Password</label>
                    <input name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="••••••••" type="password" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 text-sm font-semibold">Confirm</label>
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 outline-none" placeholder="••••••••" type="password" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 select-none">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1B3C53] focus:ring-[#1B3C53] cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-slate-600 text-sm cursor-pointer">
                    I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="underline font-semibold" style={{ color: '#1B3C53' }}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="underline font-semibold" style={{ color: '#1B3C53' }}>Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-4 rounded-lg mt-4 disabled:opacity-70" style={{ backgroundColor: '#1B3C53' }}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-slate-600">Already have an account? <button onClick={handleToggleForm} className="font-bold underline" style={{ color: '#1B3C53' }}>Log in</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E3E3E3', fontFamily: "'Public Sans', sans-serif" }}>
      <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold" style={{ color: '#1B3C53' }}>Login</h1>
            <p className="text-slate-500 mt-2">Welcome back!</p>
          </div>
          {error && <div className="mb-6 p-4 bg-red-50 border-red-500 text-red-700 text-sm rounded flex items-center gap-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#1B3C53' }}>Email Address</label>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" placeholder="email@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#1B3C53' }}>Password</label>
              <input name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-3.5 rounded-lg" style={{ backgroundColor: '#1B3C53' }}>
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
          <div className="mt-10 text-center">
            <p className="text-slate-600 text-sm">Don't have an account? <button onClick={handleToggleForm} className="font-bold underline" style={{ color: '#1B3C53' }}>Sign Up</button></p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden" style={{ backgroundColor: '#1B3C53' }}>
          <div className="relative z-10 flex flex-col items-center">
            <span className="material-symbols-outlined text-white mb-6" style={{ fontSize: '80px' }}>pets</span>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">ZOOTOPIA</h2>
            <p className="text-sm italic opacity-60 mt-12">"Professional care for every creature, great and small."</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthView;
