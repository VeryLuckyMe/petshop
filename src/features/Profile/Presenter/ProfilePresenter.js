import { useState, useEffect, useRef } from 'react';
import { ProfileModel } from '../Model/ProfileModel';

export const useProfilePresenter = (navigate) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');
  const [appointments, setAppointments] = useState([]);

  const [editForm, setEditForm] = useState({ username: '', first_name: '', last_name: '' });
  const [editStatus, setEditStatus] = useState({ type: '', msg: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [passForm, setPassForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passStatus, setPassStatus] = useState({ type: '', msg: '' });
  const [passLoading, setPassLoading] = useState(false);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoStatus, setPhotoStatus] = useState({ type: '', msg: '' });
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await ProfileModel.getSession();
      if (!session) { navigate('/'); return; }
      setUser(session.user);
      await loadProfile(session.user.email);
      setLoading(false);
    };
    init();
    const { data: { subscription } } = ProfileModel.onAuthChange((_e, session) => {
      if (!session) navigate('/');
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setEditForm({ username: profile.username || '', first_name: profile.first_name || '', last_name: profile.last_name || '' });
      if (profile.avatar_url) setPhotoPreview(profile.avatar_url);
    }
  }, [profile]);

  const loadProfile = async (email) => {
    const { data, error } = await ProfileModel.getProfile(email);
    if (!error && data) setProfile(data);
    const { data: apptData } = await ProfileModel.getAppointments(email);
    if (apptData) setAppointments(apptData);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditStatus({ type: '', msg: '' });
    try {
      const { error: dbError } = await ProfileModel.updateProfile(user.email, {
        username: editForm.username, first_name: editForm.first_name, last_name: editForm.last_name
      });
      if (dbError) throw dbError;
      await ProfileModel.updateAuthUser({ data: { username: editForm.username, first_name: editForm.first_name, last_name: editForm.last_name } });
      await loadProfile(user.email);
      setEditStatus({ type: 'success', msg: 'Profile updated!' });
    } catch (err) {
      setEditStatus({ type: 'error', msg: err.message });
    } finally { setEditLoading(false); }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoBlob) return;
    setPhotoLoading(true);
    try {
      const fileExt = photoBlob.name ? photoBlob.name.split('.').pop() : 'png';
      const fileName = `${user.id || 'avatar'}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload raw file to Supabase storage
      const { error: uploadError } = await ProfileModel.uploadAvatarStorage(filePath, photoBlob);
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = ProfileModel.getPublicUrl(filePath);

      // Update user profile record with storage url
      const { error: dbError } = await ProfileModel.updateAvatar(user.email, publicUrl);
      if (dbError) throw dbError;

      await loadProfile(user.email);
      setPhotoStatus({ type: 'success', msg: 'Photo saved!' });
      setTimeout(() => setShowPhotoModal(false), 1200);
    } catch (err) {
      setPhotoStatus({ type: 'error', msg: err.message });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassStatus({ type: '', msg: '' });

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassStatus({ type: 'error', msg: 'Passwords do not match.' });
      setPassLoading(false);
      return;
    }

    if (passForm.newPassword.length < 6) {
      setPassStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
      setPassLoading(false);
      return;
    }

    try {
      const { error } = await ProfileModel.updateAuthUser({ password: passForm.newPassword });
      if (error) throw error;
      setPassStatus({ type: 'success', msg: 'Password changed successfully!' });
      setPassForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassStatus({ type: 'error', msg: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  return {
    user, profile, loading, activeTab, appointments, editForm, editStatus, editLoading,
    passForm, passStatus, passLoading, showPhotoModal, photoPreview, photoBlob, photoStatus, photoLoading,
    fileInputRef, setActiveTab, setEditForm, setPassForm, setShowPhotoModal, setPhotoBlob, setPhotoPreview, setPhotoStatus,
    handleEditProfile, handleUploadPhoto, handleChangePassword
  };
};
