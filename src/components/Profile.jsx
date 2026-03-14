import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const TABS = ['Profile', 'Edit Profile', 'Change Password'];

const StatusAlert = ({ status }) => {
  if (!status.msg) return null;
  const ok = status.type === 'success';
  return (
    <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium ${ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      <span className="material-symbols-outlined text-base">{ok ? 'check_circle' : 'error'}</span>
      {status.msg}
    </div>
  );
};

const InputField = ({ label, icon, type = 'text', value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
      />
    </div>
  </div>
);

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');
  const navigate = useNavigate();

  // Edit Profile state
  const [editForm, setEditForm] = useState({ username: '', first_name: '', last_name: '' });
  const [editStatus, setEditStatus] = useState({ type: '', msg: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Change Password state
  const [passForm, setPassForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passStatus, setPassStatus] = useState({ type: '', msg: '' });
  const [passLoading, setPassLoading] = useState(false);

  // Upload Photo modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoStatus, setPhotoStatus] = useState({ type: '', msg: '' });
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ─── AUTH / SESSION ───────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/'); return; }
      setUser(session.user);
      await fetchProfile(session.user.email);
      setLoading(false);
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate('/');
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      });
      if (profile.avatar_url) setPhotoPreview(profile.avatar_url);
    }
  }, [profile]);

  // ─── APIs ─────────────────────────────────────────────
  const fetchProfile = async (email) => {
    const { data, error } = await supabase
      .from('zootopiaDatabase')
      .select('*')
      .eq('email', email)
      .single();
    if (!error && data) setProfile(data);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditStatus({ type: '', msg: '' });
    try {
      const { error: dbError } = await supabase
        .from('zootopiaDatabase')
        .update({ username: editForm.username, first_name: editForm.first_name, last_name: editForm.last_name })
        .eq('email', user.email);
      if (dbError) throw dbError;
      await supabase.auth.updateUser({ data: { username: editForm.username, first_name: editForm.first_name, last_name: editForm.last_name } });
      await fetchProfile(user.email);
      setEditStatus({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (err) {
      setEditStatus({ type: 'error', msg: err.message || 'Failed to update profile.' });
    } finally { setEditLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassStatus({ type: '', msg: '' });
    if (passForm.newPassword !== passForm.confirmPassword) { setPassStatus({ type: 'error', msg: 'Passwords do not match.' }); setPassLoading(false); return; }
    if (passForm.newPassword.length < 6) { setPassStatus({ type: 'error', msg: 'Password must be at least 6 characters.' }); setPassLoading(false); return; }
    try {
      const { error } = await supabase.auth.updateUser({ password: passForm.newPassword });
      if (error) throw error;
      setPassStatus({ type: 'success', msg: 'Password changed successfully!' });
      setPassForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassStatus({ type: 'error', msg: err.message || 'Failed to change password.' });
    } finally { setPassLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPhotoStatus({ type: 'error', msg: 'Only .jpg and .png files are accepted.' }); return;
    }
    setPhotoStatus({ type: '', msg: '' });
    const reader = new FileReader();
    reader.onloadend = () => { setPhotoPreview(reader.result); setPhotoBlob(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoBlob) { setPhotoStatus({ type: 'error', msg: 'Please select a photo first.' }); return; }
    setPhotoLoading(true);
    try {
      const { error } = await supabase
        .from('zootopiaDatabase')
        .update({ avatar_url: photoBlob })
        .eq('email', user.email);
      if (error) throw error;
      await fetchProfile(user.email);
      setPhotoStatus({ type: 'success', msg: 'Photo saved!' });
      setTimeout(() => { setShowPhotoModal(false); setPhotoBlob(null); setPhotoStatus({ type: '', msg: '' }); }, 1200);
    } catch (err) {
      setPhotoStatus({ type: 'error', msg: err.message || 'Failed to upload photo.' });
    } finally { setPhotoLoading(false); }
  };

  // ─── HELPERS ──────────────────────────────────────────
  const displayName = profile?.username || user?.email || 'User';
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || displayName;
  const avatarFallback = displayName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-display">

      {/* ─── TOP NAV ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="material-symbols-outlined text-orange-500 text-2xl">pets</span>
            <span className="font-black text-slate-800 text-lg group-hover:text-orange-500 transition-colors">Zootopia</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-orange-500 transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">

        {/* ─── HERO CARD ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-3xl shadow-xl text-white">
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl border-4 border-white/30 shadow-xl overflow-hidden bg-orange-300">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl font-black">
                    {avatarFallback}
                  </div>
                )}
              </div>
              {/* Camera button */}
              <button
                onClick={() => { setPhotoStatus({ type: '', msg: '' }); setPhotoBlob(null); setShowPhotoModal(true); }}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Change Photo"
              >
                <span className="material-symbols-outlined text-orange-500 text-[18px]">photo_camera</span>
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left pb-1">
              <h1 className="text-3xl font-black tracking-tight drop-shadow">{fullName}</h1>
              <p className="text-white/80 text-sm mt-0.5">@{profile?.username || '—'}</p>
              <p className="text-white/70 text-xs mt-0.5">{profile?.email || user?.email}</p>
              <span className="inline-block mt-3 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full capitalize tracking-wide border border-white/30">
                {profile?.role || 'user'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── TABS + CONTENT ─── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setEditStatus({ type: '', msg: '' }); setPassStatus({ type: '', msg: '' }); }}
                className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ── VIEW PROFILE ── */}
          {activeTab === 'Profile' && (
            <div className="p-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Account Details</p>
              <div className="space-y-3">
                {[
                  { icon: 'badge', label: 'Username', value: profile?.username },
                  { icon: 'person', label: 'First Name', value: profile?.first_name },
                  { icon: 'person', label: 'Last Name', value: profile?.last_name },
                  { icon: 'mail', label: 'Email', value: profile?.email || user?.email },
                  { icon: 'shield_person', label: 'Role', value: profile?.role },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-orange-200 group-hover:bg-orange-50 flex items-center justify-center shadow-sm flex-shrink-0 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 text-[18px] transition-colors">{icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                      <p className="text-slate-800 font-semibold text-sm truncate">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EDIT PROFILE ── */}
          {activeTab === 'Edit Profile' && (
            <div className="p-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Update your information</p>
              <form onSubmit={handleEditProfile} className="space-y-4 max-w-md">
                <StatusAlert status={editStatus} />
                <InputField label="Username" icon="badge" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} placeholder="Your username" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" icon="person" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} placeholder="First name" />
                  <InputField label="Last Name" icon="person" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} placeholder="Last name" />
                </div>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {editLoading
                    ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><span className="material-symbols-outlined text-lg">save</span> Save Changes</>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── CHANGE PASSWORD ── */}
          {activeTab === 'Change Password' && (
            <div className="p-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Set a new password</p>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <StatusAlert status={passStatus} />
                <InputField label="New Password" icon="lock" type="password" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} placeholder="••••••••" />
                <InputField label="Confirm Password" icon="lock_reset" type="password" value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} placeholder="••••••••" />
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span> At least 6 characters.
                </p>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {passLoading
                    ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><span className="material-symbols-outlined text-lg">lock_reset</span> Update Password</>
                  }
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ─── UPLOAD PHOTO MODAL ─── */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPhotoModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 space-y-5 relative">
            {/* Close */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500 text-[18px]">close</span>
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-800">Change Photo</h3>
              <p className="text-xs text-slate-400 mt-0.5">Accepts .jpg and .png files</p>
            </div>

            <StatusAlert status={photoStatus} />

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-8 cursor-pointer transition-colors hover:bg-orange-50 group"
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="preview" className="w-24 h-24 rounded-2xl object-cover border-4 border-orange-200 shadow" />
                  <p className="text-xs text-slate-400 group-hover:text-orange-500 transition-colors">Click to change</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 text-3xl transition-colors">cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Click to select a photo</p>
                    <p className="text-xs text-slate-400 mt-0.5">.jpg or .png</p>
                  </div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadPhoto}
                disabled={photoLoading || !photoBlob}
                className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm"
              >
                {photoLoading
                  ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span className="material-symbols-outlined text-[16px]">upload</span> Save</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
