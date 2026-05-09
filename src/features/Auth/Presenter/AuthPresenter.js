import { useState } from 'react';
import { AuthModel } from '../Model/AuthModel';

export const useAuthPresenter = (navigate) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccessMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.username) {
          throw new Error("All fields are required.");
        }
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match!");

        const { error: signUpError } = await AuthModel.signUp(formData.email, formData.password, {
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName
        });
        if (signUpError) throw signUpError;

        const { error: insertError } = await AuthModel.createProfile({
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          role: 'user'
        });
        if (insertError) throw insertError;

        setSuccessMsg("Registration successful! Redirecting...");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        const { error: signInError } = await AuthModel.login(formData.email, formData.password);
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password.");
          }
          throw signInError;
        }
        setIsLoadingPage(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSignUp, isLoading, isLoadingPage, showPassword, error, successMsg, formData,
    handleToggleForm, handleChange, handleSubmit, setShowPassword
  };
};
