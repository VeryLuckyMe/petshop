import React from 'react';
import Navbar from '../../../components/Navbar';
import { useAboutPresenter } from '../Presenter/AboutPresenter';

function AboutView() {
  const { user } = useAboutPresenter();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar user={user} />

        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[1200px] px-6 py-10">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                  <h1 className="text-brand-dark dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight tracking-tight mb-6">
                    About <span className="text-primary">Zootopia</span>
                  </h1>
                  <p className="text-lg text-brand-light leading-relaxed mb-6">
                    Founded in 2026, Zootopia started with a simple mission: to provide the highest standard of care for the pets in our community. We believe that every pet deserves to be treated like family.
                  </p>
                  <p className="text-lg text-brand-light leading-relaxed">
                    From our humble beginnings as a small grooming salon, we have grown into a full-service pet care facility offering everything from premium nutrition to state-of-the-art health checkups.
                  </p>
                </div>
                <div className="w-full md:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000&auto=format&fit=crop"
                    alt="Happy dog with owner"
                    className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Core Values */}
            <section className="mb-16 bg-white dark:bg-brand-dark p-12 rounded-3xl border border-brand-soft shadow-sm">
              <h2 className="text-3xl font-black text-center mb-12">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">favorite</span>
                  </div>
                  <h3 className="font-bold text-xl">Compassion</h3>
                  <p className="text-brand-light">We handle every animal with the love and gentleness they deserve, minimizing stress and maximizing comfort.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <h3 className="font-bold text-xl">Expertise</h3>
                  <p className="text-brand-light">Our team consists of certified groomers and experienced care professionals dedicated to continuous learning.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">eco</span>
                  </div>
                  <h3 className="font-bold text-xl">Quality</h3>
                  <p className="text-brand-light">We only use top-tier, pet-safe products and offer premium nutrition options carefully selected by our experts.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AboutView;
