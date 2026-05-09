import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useDashboardPresenter } from '../Presenter/DashboardPresenter';
import { useCartModel } from '../../Cart/Model/CartContext';

function DashboardView() {
  const navigate = useNavigate();
  const { user, loading, products, bookingStatus, handleBookService } = useDashboardPresenter(navigate);
  const { addToCart } = useCartModel();

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
            {/* Hero */}
            <div className="@container mb-12">
              <div className="flex flex-col gap-8 md:flex-row bg-brand-medium rounded-xl overflow-hidden min-h-[400px]">
                <div className="w-full md:w-1/2 bg-center bg-cover min-h-[300px]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUPoBMX5MvwaJAoNc00Mnz7afdACyxkZirovqMACle-wFCrExOO1KwDXmsly8S_ehuuQDOacjLl_AERyXVREi6zGTgTmqqNcM7sIZ9lqfnx2_Hh70RV1xqqMjRZz8ha1z0nDoeZ7Lu7VP3iBQSyZTYvTLXWb2NBa4oA96LAyuuyUTQim-Sjy4WV7j580KP7Y2RDlI586KAkQSfuMzjbKwn1paeivX9LXLsifL2bS0HZZ3bouu7eJ1KfgAgwmUQemuW6WknJXxQ17E")' }}></div>
                <div className="flex flex-col p-8 md:p-12 gap-6 md:w-1/2 justify-center bg-brand-medium">
                  <h1 className="text-white text-4xl font-black">Your Pet's Happiness, <span className="text-primary">Our Priority</span></h1>
                  <p className="text-brand-soft text-lg">Professional care tailored to your pet's needs.</p>
                  <button onClick={() => handleBookService('General Consultation')} className="w-40 py-3 bg-primary text-white font-bold rounded-lg hover:scale-105 transition-all">
                    {bookingStatus === 'General Consultation' ? 'Booked!' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <section className="mb-16">
              <h2 className="text-3xl font-black mb-8 border-b border-brand-soft pb-4">Featured Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50">
                    <div className="aspect-square overflow-hidden"><img className="w-full h-full object-cover transition-transform group-hover:scale-105" src={product.image_url} alt={product.name} /></div>
                    <div className="p-4">
                      <p className="text-xs text-brand-light font-bold">{product.category}</p>
                      <h4 className="font-bold text-sm">{product.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-lg">${product.price}</span>
                        <button onClick={() => addToCart(product)} className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors"><span className="material-symbols-outlined text-sm">add_shopping_cart</span></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
        <footer className="bg-brand-dark text-white px-20 py-12 text-center text-xs opacity-60">© 2024 Zootopia Animal Care Services.</footer>
      </div>
    </div>
  );
}

export default DashboardView;
