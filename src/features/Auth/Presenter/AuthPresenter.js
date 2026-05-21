import { useState } from 'react';
import { AuthModel } from '../Model/AuthModel';

export const useAuthPresenter = (navigate) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setAgreeTerms(false);
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
      const trimmedEmail = formData.email.trim();
      if (isSignUp) {
        const trimmedUsername = formData.username.trim();
        const trimmedFirstName = formData.firstName.trim();
        const trimmedLastName = formData.lastName.trim();

        if (!trimmedEmail || !formData.password || !formData.confirmPassword || !trimmedFirstName || !trimmedLastName || !trimmedUsername) {
          throw new Error("All fields are required.");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match!");
        }
        if (!agreeTerms) {
          throw new Error("You must agree to the Terms of Service and Privacy Policy.");
        }

        const { error: signUpError } = await AuthModel.signUp(trimmedEmail, formData.password, {
          username: trimmedUsername,
          first_name: trimmedFirstName,
          last_name: trimmedLastName
        });
        if (signUpError) throw signUpError;

        const { error: insertError } = await AuthModel.createProfile({
          username: trimmedUsername,
          first_name: trimmedFirstName,
          last_name: trimmedLastName,
          email: trimmedEmail,
          role: 'user'
        });
        if (insertError) throw insertError;

        // Clear passwords and switch to login mode
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setAgreeTerms(false);
        setIsSignUp(false);
        setSuccessMsg("Registration successful! Please check your email to verify and log in.");
      } else {
        if (!trimmedEmail || !formData.password) {
          throw new Error("Email and password are required.");
        }
        const { error: signInError } = await AuthModel.login(trimmedEmail, formData.password);
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
    isSignUp, isLoading, isLoadingPage, showPassword, error, successMsg, formData, agreeTerms,
    handleToggleForm, handleChange, handleSubmit, setShowPassword, setAgreeTerms
  };
};
