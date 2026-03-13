import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
        {/* Navigation Header */}
        <header className="flex items-center justify-between whitespace-nowrap bg-brand-dark border-b border-brand-medium px-6 md:px-20 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-3xl">pets</span>
              <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Zootopia</h2>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Products</a>
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Services</a>
              <a className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">About Us</a>
            </nav>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <label className="hidden lg:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
                <div className="text-brand-soft flex border-none bg-brand-medium items-center justify-center pl-4 pr-1">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 border-none bg-brand-medium text-white focus:ring-0 placeholder:text-brand-soft/60 px-2 text-sm font-normal"
                  placeholder="Search care plans..."
                  type="text"
                />
              </div>
            </label>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-brand-soft text-sm hidden sm:inline">
                  {user.user_metadata?.username || user.email}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:brightness-110"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[1200px] px-6 py-10">
            {/* Hero Section */}
            <div className="@container mb-12">
              <div className="flex flex-col gap-8 md:flex-row items-stretch bg-brand-medium rounded-xl overflow-hidden min-h-[400px]">
                <div
                  className="w-full md:w-1/2 bg-center bg-no-repeat bg-cover min-h-[300px]"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUPoBMX5MvwaJAoNc00Mnz7afdACyxkZirovqMACle-wFCrExOO1KwDXmsly8S_ehuuQDOacjLl_AERyXVREi6zGTgTmqqNcM7sIZ9lqfnx2_Hh70RV1xqqMjRZz8ha1z0nDoeZ7Lu7VP3iBQSyZTYvTLXWb2NBa4oA96LAyuuyUTQim-Sjy4WV7j580KP7Y2RDlI586KAkQSfuMzjbKwn1paeivX9LXLsifL2bS0HZZ3bouu7eJ1KfgAgwmUQemuW6WknJXxQ17E")' }}
                >
                </div>
                <div className="flex flex-col p-8 md:p-12 gap-6 md:w-1/2 justify-center bg-brand-medium">
                  <div className="flex flex-col gap-4 text-left">
                    <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                      Your Pet's Happiness, <br /><span className="text-primary">Our Priority</span>
                    </h1>
                    <p className="text-brand-soft text-lg font-normal leading-relaxed opacity-90">
                      Professional and compassionate animal care services tailored to your pet's unique needs. From grooming to gourmet treats.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold transition-all hover:scale-105">
                      <span>Book Now</span>
                    </button>
                    <button className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 border-2 border-white text-white text-base font-bold transition-all hover:bg-white hover:text-brand-dark">
                      <span>Our Story</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8 border-b border-brand-soft pb-4">
                <h2 className="text-brand-dark dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Our Premium Services</h2>
                <a className="text-primary font-bold hover:underline" href="#">View All Services</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Service 1 */}
                <div className="flex flex-col gap-4 rounded-lg border border-brand-soft bg-white dark:bg-brand-dark p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">content_cut</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-brand-dark dark:text-white text-xl font-bold">Pet Grooming</h3>
                    <p className="text-brand-light dark:text-brand-soft text-base font-normal leading-relaxed">
                      Full-service spa treatments, styling, and hygiene care for all breeds and sizes.
                    </p>
                  </div>
                  <button className="mt-2 text-primary font-semibold flex items-center gap-1 group">
                    Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
                {/* Service 2 */}

                {/* Service 3 */}
                <div className="flex flex-col gap-4 rounded-lg border border-brand-soft bg-white dark:bg-brand-dark p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">vaccines</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-brand-dark dark:text-white text-xl font-bold">Health Checkups</h3>
                    <p className="text-brand-light dark:text-brand-soft text-base font-normal leading-relaxed">
                      Routine wellness exams and vaccinations by our experienced veterinary partners.
                    </p>
                  </div>
                  <button className="mt-2 text-primary font-semibold flex items-center gap-1 group">
                    Learn More <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8 border-b border-brand-soft pb-4">
                <h2 className="text-brand-dark dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Featured Products</h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-brand-soft text-brand-light hover:bg-brand-soft transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-2 rounded-full border border-brand-soft text-brand-light hover:bg-brand-soft transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Product 1 */}
                <div className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50 transition-all">
                  <div className="aspect-square bg-brand-soft overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCec28e2NkdkTCRa_AFxvf4YHI0YIuo9cLja3OEJtzUg9JGn26R995siSx-bo8Byd3bVDNo1S9v2WlpdO29rUuBZ6jKcCxJT6ugpSKRZ6kLsf159LsdM3vn3DKffeVJW5c0uDfSnTJuTWqMjDrblmn3MWnLxuZN_GgHtGz_86ckpvLn_Z3JKfY2dStX26yM3cRAvwnYv5yhCbpfY9y_fFqW_ju69u17gvnUSpJevNZKUmAHL1CF4n8cdt7lkhV35kwQU_RamTvEybg"
                      alt="Product 1"
                    />
                    <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">HOT</span>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-xs text-brand-light font-bold uppercase tracking-wider">Nutrition</p>
                    <h4 className="text-brand-dark dark:text-white font-bold text-sm">Organic Chicken Bites</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-brand-dark dark:text-white font-black text-lg">$14.99</span>
                      <button className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Product 2 */}
                <div className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50 transition-all">
                  <div className="aspect-square bg-brand-soft overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkL_nxNyv62poXOk8T_Gtumsk_AIZXZ1HkGsF2udJ3QmqQvw1qbNpsie6wQmLNkwGxrlbX9vhpqi4pFnk02gAXirgGZ9bQiVRLfzSkMWSlOH5lkIs5Caf4Lcu9H3EFKiSFoed6-45jRquYmmwescEai6DYFp_ZnqblLSDOfG7uAk1brK-2b23gtInqIvD-KOPZukI-ZrPuJxCoYCfXB5F6fj3EFDM4cRGpqV6hv871SbsDovqHmrvOsdM5ByG3iEE6WiIJ6Rdme5Q"
                      alt="Product 2"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-xs text-brand-light font-bold uppercase tracking-wider">Toys</p>
                    <h4 className="text-brand-dark dark:text-white font-bold text-sm">Ultra-Tough Rubber Bone</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-brand-dark dark:text-white font-black text-lg">$9.50</span>
                      <button className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Product 3 */}
                <div className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50 transition-all">
                  <div className="aspect-square bg-brand-soft overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrRWyy2yQH6gxgFC4iq6UMiiSrJVNLusKLLE2xkt0GYcYNOgZs_XkTNXlXbXwKMGoOapOf09JQCWY9TKbvZo2qNxPycbb5WsFfWeZw7zDKu9DHU392rN7Qj4ncBRBWMk8H6UKELZRLQorYSLYVwdX4cJOCL6hEfEXJS7T4vAPB-PkjdBV_Bu80WC_t0P_-JCcgNrMCDzfLn9VEDT_NolB6uLbIzUiUvi3PVnnszFuzld1CU_LTYCwe1jnl131otG7vJb6tsQprztI"
                      alt="Product 3"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-xs text-brand-light font-bold uppercase tracking-wider">Bedding</p>
                    <h4 className="text-brand-dark dark:text-white font-bold text-sm">Orthopedic Dream Cloud</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-brand-dark dark:text-white font-black text-lg">$45.00</span>
                      <button className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Product 4 */}
                <div className="group flex flex-col bg-white dark:bg-brand-dark rounded-lg overflow-hidden border border-brand-soft hover:border-primary/50 transition-all">
                  <div className="aspect-square bg-brand-soft overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPJNWXUhddUfccUBU_5B_O1hI93s5XHjz4kXp040Pxhde3A65XaBXGu2OdT-w5zVZZqKlS7Cq6-2jDiPqkgpX-JKDEPGjO2YPTUjURkGmN8h-V7TIFaKKq9Wp1imyNVp3DHXfmBk2d_G4j_iliL6DTpeWONdV2xlqJsj7HjMAk7W_B3rzLzmHR41Bft_Aqxxf7x3QkxYaWWGz3osQHRMmuadRUQrX2PPmhV39Z0aAjLmXMnF4CjDTfoQa-5etwwtmRAG_6x1Mv8pY"
                      alt="Product 4"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <p className="text-xs text-brand-light font-bold uppercase tracking-wider">Accessories</p>
                    <h4 className="text-brand-dark dark:text-white font-bold text-sm">ZenFlow Water Fountain</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-brand-dark dark:text-white font-black text-lg">$29.99</span>
                      <button className="bg-brand-dark text-white p-2 rounded-lg hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-brand-dark text-white px-6 md:px-20 py-12 mt-auto">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined">pets</span>
                <span className="text-xl font-bold">Zootopia</span>
              </div>
              <p className="text-brand-soft text-sm leading-relaxed">
                Serving our community with dedicated animal care since 2010. Your pets deserve the best, and we are here to provide it.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-brand-soft text-sm flex flex-col gap-2">
                <li><a className="hover:text-primary transition-colors" href="#">Appointments</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pet Tips Blog</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Store Locator</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Care</h4>
              <ul className="text-brand-soft text-sm flex flex-col gap-2">
                <li><a className="hover:text-primary transition-colors" href="#">Shipping Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Return Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-brand-soft text-xs mb-4">Get the latest pet care tips and deals.</p>
              <div className="flex h-10">
                <input
                  className="bg-brand-medium border-none text-white text-xs px-3 rounded-l-lg w-full focus:ring-1 focus:ring-primary"
                  placeholder="Email address"
                  type="email"
                />
                <button className="bg-primary px-4 rounded-r-lg hover:brightness-110">
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-brand-medium text-brand-soft text-center text-xs">
            © 2024 Zootopia Animal Care Services. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
