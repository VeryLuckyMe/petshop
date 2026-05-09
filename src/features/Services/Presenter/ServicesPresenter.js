import { useState, useEffect } from 'react';
import { ServicesModel } from '../Model/ServicesModel';

export const useServicesPresenter = (navigate) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await ServicesModel.getSession();
      if (session) setUser(session.user);
      setLoading(false);
    };
    init();
  }, []);

  const handleBookService = async (serviceName) => {
    if (!user) {
      alert("Please log in to book a service.");
      navigate('/');
      return;
    }
    const { error } = await ServicesModel.bookAppointment({
      user_email: user.email,
      service_name: serviceName
    });
    if (!error) {
      setBookingStatus(serviceName);
      setTimeout(() => setBookingStatus(''), 3000);
      alert(`Successfully booked: ${serviceName}! You can view this in your Profile.`);
    } else {
      alert("Failed to book service. Please try again.");
    }
  };

  return { user, loading, bookingStatus, handleBookService };
};
