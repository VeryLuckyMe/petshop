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
  const { 
    user, loading, step, setStep, 
    selectedService, setSelectedService, 
    selectedAddons, toggleAddon,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    petDetails, updatePetDetails,
    paymentMethod, setPaymentMethod,
    goToNextStep, goToPrevStep, handleConfirmBooking,
    bookingStatus, loyaltyPoints, getVoucherDiscount
  } = useServicesPresenter(navigate);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const estimatedTotal = (selectedService?.price || 0) + selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const renderStepIndicator = () => (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`relative z-10 flex flex-col items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${s <= step ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
            {s}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2 text-xs font-bold text-slate-500">
        <span className={step >= 1 ? 'text-primary' : ''}>Service</span>
        <span className={step >= 2 ? 'text-primary' : ''}>Schedule</span>
        <span className={step >= 3 ? 'text-primary' : ''}>Pet</span>
        <span className={step >= 4 ? 'text-primary' : ''}>Payment</span>
        <span className={step >= 5 ? 'text-primary' : ''}>Confirm</span>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar user={user} />
        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[1200px] px-6 py-10">
            <h1 className="text-brand-dark dark:text-slate-100 text-4xl font-black mb-2 text-center">Book an Appointment</h1>
            <p className="text-brand-light mb-12 text-center">Professional care for your furry friends.</p>

            {renderStepIndicator()}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1 bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-sm border border-brand-soft">
                
                {/* STEP 1: Select Service */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {serviceOptions.map((service) => (
                        <div 
                          key={service.id} 
                          onClick={() => setSelectedService(service)}
                          className={`flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <h3 className="font-bold">{service.name}</h3>
                          <div className="flex justify-between items-center text-sm text-slate-500">
                            <span>{service.duration}</span>
                            <span className="font-bold text-slate-800">₱{service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold mb-4">Optional Add-ons</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {addonOptions.map((addon) => {
                        const isSelected = selectedAddons.some(a => a.id === addon.id);
                        return (
                          <div 
                            key={addon.id} 
                            onClick={() => toggleAddon(addon)}
                            className={`flex flex-col items-center text-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
                          >
                            <h4 className="font-bold text-sm">{addon.name}</h4>
                            <span className="text-slate-500 text-xs font-bold">+₱{addon.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Choose Date & Time */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
                    <div className="mb-6">
                      <label className="block font-bold mb-2">Select Date</label>
                      <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">Select Time</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(time => (
                          <div 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg text-center cursor-pointer border-2 font-bold text-sm ${selectedTime === time ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Pet Details */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Pet Details</h2>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block font-bold text-sm mb-1">Pet Name</label>
                        <input 
                          type="text" 
                          value={petDetails.name} 
                          onChange={(e) => updatePetDetails('name', e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-lg"
                          placeholder="e.g. Bella"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-sm mb-1">Pet Type</label>
                        <select 
                          value={petDetails.type} 
                          onChange={(e) => updatePetDetails('type', e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-lg"
                        >
                          <option>Dog</option>
                          <option>Cat</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-sm mb-1">Breed</label>
                          <input 
                            type="text" 
                            value={petDetails.breed} 
                            onChange={(e) => updatePetDetails('breed', e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg"
                            placeholder="e.g. Golden Retriever"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-sm mb-1">Age (Years)</label>
                          <input 
                            type="number" 
                            value={petDetails.age} 
                            onChange={(e) => updatePetDetails('age', e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg"
                            placeholder="e.g. 3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Payment Method */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                    <div className="space-y-4 max-w-md">
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'pay_in_store' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="pay_in_store"
                          checked={paymentMethod === 'pay_in_store'}
                          onChange={() => setPaymentMethod('pay_in_store')}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="font-bold text-lg">Pay in Store</p>
                          <p className="text-slate-500 text-sm">Pay when you arrive for your appointment</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="font-bold text-lg">Credit / Debit Card</p>
                          <p className="text-slate-500 text-sm">Pay securely online</p>
                        </div>
                      </label>
                      
                      {loyaltyPoints >= 10 && (
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'loyalty_points' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="loyalty_points"
                            checked={paymentMethod === 'loyalty_points'}
                            onChange={() => setPaymentMethod('loyalty_points')}
                            className="w-5 h-5 text-primary"
                          />
                          <div>
                            <p className="font-bold text-lg">Use Loyalty Points</p>
                            <p className="text-slate-500 text-sm">Use {Math.floor(loyaltyPoints/10)*10} points to save ₱{getVoucherDiscount().toFixed(2)}</p>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: Confirm & Pay */}
                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                      <h3 className="font-bold text-lg mb-4">Appointment Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Service</span>
                          <span className="font-bold text-slate-800">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Date & Time</span>
                          <span className="font-bold text-slate-800">{selectedDate} at {selectedTime}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Pet</span>
                          <span className="font-bold text-slate-800">{petDetails.name} ({petDetails.type})</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Payment Method</span>
                          <span className="font-bold text-slate-800">
                            {paymentMethod === 'pay_in_store' ? 'Pay in Store' : paymentMethod === 'credit_card' ? 'Credit Card' : 'Loyalty Points'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {bookingStatus === 'success' && (
                      <div className="p-4 bg-green-100 text-green-800 font-bold rounded-lg text-center">
                        Appointment successfully booked!
                      </div>
                    )}
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-6">
                  {step > 1 ? (
                    <button onClick={goToPrevStep} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      Back
                    </button>
                  ) : <div></div>}

                  {step < 5 ? (
                    <button 
                      onClick={goToNextStep} 
                      disabled={step === 1 && !selectedService || step === 2 && (!selectedDate || !selectedTime) || step === 3 && !petDetails.name}
                      className="px-8 py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                    >
                      Continue
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConfirmBooking(estimatedTotal)}
                      disabled={bookingStatus === 'success'}
                      className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {bookingStatus === 'success' ? 'Confirmed!' : 'Confirm Appointment'}
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Summary Area */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-sm border border-brand-soft sticky top-24">
                  <h3 className="font-black text-xl mb-4">Summary</h3>
                  
                  {!selectedService ? (
                    <p className="text-slate-500 text-sm">Select a service to see details.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-brand-dark">{selectedService.name}</p>
                          <p className="text-xs text-slate-500">{selectedService.duration}</p>
                        </div>
                        <span className="font-bold">₱{selectedService.price}</span>
                      </div>
                      
                      {selectedAddons.length > 0 && (
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Add-ons</p>
                          {selectedAddons.map(addon => (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span className="text-slate-600">{addon.name}</span>
                              <span className="font-bold">₱{addon.price}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(selectedDate && selectedTime) && (
                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-xs font-bold text-slate-400 uppercase">Schedule</p>
                          <p className="text-sm font-bold text-brand-dark">{selectedDate} @ {selectedTime}</p>
                        </div>
                      )}

                      <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-lg">
                        <span className="font-black text-slate-800">Total</span>
                        <span className="font-black text-primary">
                          ₱{paymentMethod === 'loyalty_points' ? Math.max(0, estimatedTotal - getVoucherDiscount()) : estimatedTotal}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ServicesView;
