import { useState, useEffect } from 'react';
import { DashboardModel } from '../Model/DashboardModel';

export const useDashboardPresenter = (navigate) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await DashboardModel.getSession();
      if (session) setUser(session.user);
      else navigate('/');
      
      const { data, error } = await DashboardModel.getProducts();
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = DashboardModel.onAuthChange((_event, session) => {
      if (session) setUser(session.user);
      else navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleBookService = async (serviceName) => {
    if (!user) {
      alert("Please log in to book a service.");
      return;
    }
    const { error } = await DashboardModel.bookAppointment({
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

  return { user, loading, products, bookingStatus, handleBookService };
};
