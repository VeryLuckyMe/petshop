import { useState, useEffect } from 'react';
import { ServicesModel } from '../Model/ServicesModel';
import { useCartModel } from '../../Cart/Model/CartContext';

export const useServicesPresenter = (navigate) => {
  const { loyaltyPoints, useLoyaltyPoints, getVoucherDiscount } = useCartModel();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stepper State
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [petDetails, setPetDetails] = useState({ name: '', type: 'Dog', breed: '', age: '' });
  const [paymentMethod, setPaymentMethod] = useState('pay_in_store');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await ServicesModel.getSession();
      if (session) setUser(session.user);
      setLoading(false);
    };
    init();
  }, []);

  const goToNextStep = () => {
    if (!user && step === 1) {
      alert("Please log in to book an appointment.");
      navigate('/auth'); // Or whatever the auth route is
      return;
    }
    setStep(s => Math.min(s + 1, 5));
  };

  const goToPrevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id) 
        : [...prev, addon]
    );
  };

  const updatePetDetails = (field, value) => {
    setPetDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async (totalAmount) => {
    if (!user) return;
    
    // In a real app, you would compile all details and send to your backend/supabase.
    // For now we'll format a summary and use the existing ServicesModel.
    let serviceName = `${selectedService.name} on ${selectedDate} at ${selectedTime}`;
    
    if (paymentMethod === 'loyalty_points') {
        const discountAmount = Math.floor(loyaltyPoints / 10) * 50;
        serviceName += ` (Paid with points. Discount: ₱${discountAmount})`;
        useLoyaltyPoints(Math.floor(loyaltyPoints / 10) * 10);
    }
    const { error } = await ServicesModel.bookAppointment({
      user_email: user.email,
      service_name: serviceName
    });

    if (!error) {
      setBookingStatus('success');
      alert(`Booking confirmed for ${serviceName}!`);
      // Reset after 3 seconds and go back to step 1
      setTimeout(() => {
        setBookingStatus('');
        setStep(1);
        setSelectedService(null);
        setSelectedAddons([]);
        setSelectedDate('');
        setSelectedTime('');
        setPetDetails({ name: '', type: 'Dog', breed: '', age: '' });
      }, 3000);
    } else {
      alert("Failed to book service. Please try again.");
    }
  };

  return { 
    user, loading, step, setStep, 
    selectedService, setSelectedService, 
    selectedAddons, toggleAddon,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    petDetails, updatePetDetails,
    paymentMethod, setPaymentMethod,
    goToNextStep, goToPrevStep, handleConfirmBooking,
    bookingStatus, loyaltyPoints, getVoucherDiscount
  };
};
