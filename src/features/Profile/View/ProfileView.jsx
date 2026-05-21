import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useProfilePresenter } from '../Presenter/ProfilePresenter';

const TABS = ['Profile', 'My Appointments', 'Edit Profile', 'Change Password'];

function ProfileView() {
  const navigate = useNavigate();
  const {
    user, profile, loading, activeTab, appointments, editForm, editStatus, editLoading,
    passForm, passStatus, passLoading, showPhotoModal, photoPreview, photoStatus, photoLoading,
    fileInputRef, setActiveTab, setEditForm, setPassForm, setShowPhotoModal, setPhotoBlob, setPhotoPreview,
    handleEditProfile, handleUploadPhoto, handleChangePassword
  } = useProfilePresenter(navigate);

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;

  const displayName = profile?.username || user?.email || 'User';
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || displayName;

  return (
    <div className="min-h-screen ambient-bg font-display text-slate-800">
      <Navbar user={user} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl pulse-avatar-frame overflow-hidden bg-orange-300 border-white/30">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black">
                    {displayName[0].toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-orange-500">photo_camera</span>
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black">{fullName}</h1>
              <p className="opacity-80">@{profile?.username || 'user'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/40 shadow-xl">
          <div className="flex border-b border-slate-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold transition-all ${
                  activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ── VIEW PROFILE ── */}
            {activeTab === 'Profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Username', value: profile?.username, icon: 'badge' },
                  { label: 'First Name', value: profile?.first_name, icon: 'person' },
                  { label: 'Last Name', value: profile?.last_name, icon: 'person' },
                  { label: 'Email', value: profile?.email || user?.email, icon: 'mail' },
                  { label: 'Role', value: profile?.role, icon: 'shield_person' },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── MY APPOINTMENTS ── */}
            {activeTab === 'My Appointments' && (
              <div className="space-y-3">
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <div key={appt.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">event</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{appt.service_name}</p>
                          <p className="text-xs text-slate-400">{new Date(appt.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        appt.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <p>No appointments found.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── EDIT PROFILE ── */}
            {activeTab === 'Edit Profile' && (
              <form onSubmit={handleEditProfile} className="space-y-5 max-w-md">
                {editStatus.msg && (
                  <div className={`p-4 rounded-xl text-sm font-bold ${editStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {editStatus.msg}
                  </div>
                )}
                <div className="space-y-1.5 focus-line-container">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
                  <input
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
                    placeholder="Username"
                  />
                  <span className="focus-line-bar"></span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 focus-line-container">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
                      placeholder="First Name"
                    />
                    <span className="focus-line-bar"></span>
                  </div>
                  <div className="space-y-1.5 focus-line-container">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
                      placeholder="Last Name"
                    />
                    <span className="focus-line-bar"></span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  {editLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Changes'}
                </button>
              </form>
            )}

            {/* ── CHANGE PASSWORD ── */}
            {activeTab === 'Change Password' && (
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                {passStatus.msg && (
                  <div className={`p-4 rounded-xl text-sm font-bold ${passStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {passStatus.msg}
                  </div>
                )}
                <div className="space-y-1.5 focus-line-container">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <span className="focus-line-bar"></span>
                </div>
                <div className="space-y-1.5 focus-line-container">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password</label>
                  <input
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all text-sm"
                    placeholder="••••••••"
                  />
                  <span className="focus-line-bar"></span>
                </div>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  {passLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ── PHOTO MODAL ── */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-1 text-slate-800">Update Photo</h3>
            <p className="text-xs text-slate-400 mb-6 uppercase font-bold tracking-widest">Select a new profile picture</p>

            {photoStatus.msg && (
              <div className={`p-4 rounded-xl text-sm font-bold mb-4 ${photoStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {photoStatus.msg}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-all group mb-6"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="w-24 h-24 rounded-2xl object-cover border-4 border-orange-100 shadow-sm" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-orange-400 transition-colors">upload_file</span>
              )}
              <p className="text-sm font-bold text-slate-500">Click to upload</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhotoPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                    setPhotoBlob(file);
                  }
                }}
                className="hidden"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                disabled={photoLoading || !photoBlob}
                className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
              >
                {photoLoading ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;
