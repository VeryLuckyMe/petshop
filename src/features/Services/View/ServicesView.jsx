import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useServicesPresenter } from '../Presenter/ServicesPresenter';

const serviceOptions = [
  { id: 1, name: 'Full Grooming', duration: '2 - 3 hrs', price: 3500 },
  { id: 2, name: 'Bath & Dry', duration: '1 - 1.5 hrs', price: 1900 },
  { id: 3, name: 'Hair Trim & Styling', duration: '1 - 2 hrs', price: 2200 },
  { id: 4, name: 'Nail Clipping', duration: '15 min', price: 800 },
  { id: 5, name: 'Ear Cleaning', duration: '10 min', price: 650 },
  { id: 6, name: 'Teeth Brushing', duration: '15 min', price: 950 }
];

const addonOptions = [
  { id: 1, name: 'Flea Treatment', price: 1100 },
  { id: 2, name: 'Perfume Spritz', price: 250 },
  { id: 3, name: 'Paw Wax', price: 550 },
  { id: 4, name: 'Blueberry Facial', price: 800 },
  { id: 5, name: 'Tooth Brushing', price: 650 },
  { id: 6, name: 'De-shedding', price: 1350 }
];

function ServicesView() {
  const navigate = useNavigate();
  const { user, loading, bookingStatus, handleBookService } = useServicesPresenter(navigate);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar user={user} />
        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[1200px] px-6 py-10">
            <h1 className="text-brand-dark dark:text-slate-100 text-4xl font-black mb-4">Grooming & Services</h1>
            <p className="text-brand-light mb-12">Professional care for your furry friends.</p>

            <h2 className="text-2xl font-bold mb-6">Main Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {serviceOptions.map((service) => (
                <div key={service.id} className="flex flex-col gap-4 rounded-lg border border-brand-soft bg-white dark:bg-brand-dark p-6 shadow-sm">
                  <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-2xl">content_cut</span>
                  </div>
                  <h3 className="text-brand-dark dark:text-white text-xl font-bold">{service.name}</h3>
                  <div className="flex justify-between items-center text-sm text-brand-light">
                    <span>{service.duration}</span>
                    <span className="font-bold text-lg text-brand-dark dark:text-white">₱{service.price}</span>
                  </div>
                  <button onClick={() => handleBookService(service.name)} className="mt-4 w-full py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-primary transition-colors">
                    {bookingStatus === service.name ? 'Booked!' : 'Book Service'}
                  </button>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6">Optional Add-ons</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {addonOptions.map((addon) => (
                <div key={addon.id} className="flex flex-col items-center text-center gap-2 p-4 rounded-lg border border-brand-soft bg-white dark:bg-brand-dark">
                  <div className="bg-orange-50 text-orange-500 w-10 h-10 rounded-full flex items-center justify-center mb-1">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <h4 className="font-bold text-sm">{addon.name}</h4>
                  <span className="text-brand-light text-xs font-bold">₱{addon.price}</span>
                  <button onClick={() => handleBookService(addon.name)} className="mt-2 text-xs text-primary font-bold hover:underline">
                    {bookingStatus === addon.name ? 'Added!' : 'Add to Booking'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ServicesView;
