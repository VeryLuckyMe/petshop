import React, { useState, useMemo } from 'react';
import Navbar from '../../../components/Navbar';
import { useAboutPresenter } from '../Presenter/AboutPresenter';

const FAQ_DATA = [
  {
    id: 'orders', label: 'Orders & Shipping', icon: 'local_shipping',
    items: [
      { q: 'How long does standard shipping take?', a: 'Standard shipping takes 3–5 business days within Metro Manila and 5–7 days for provincial addresses.' },
      { q: 'Can I change my shipping address after ordering?', a: 'You can update your address if the order is not yet packed. Contact support immediately with your order number.' },
      { q: 'How do I track my order?', a: 'Go to your profile order history and open the order details page to see courier updates and tracking number.' },
      { q: 'What if my order is lost in transit?', a: 'If tracking is stalled, we will investigate with the courier and either resend your order or process a full refund.' },
    ]
  },
  {
    id: 'grooming', label: 'Grooming Services', icon: 'content_cut',
    items: [
      { q: 'How do I book a grooming appointment?', a: 'Open the Services page, select your package, choose a date and time, then confirm your booking.' },
      { q: 'What grooming packages are available?', a: 'We offer Full Grooming, Bath & Dry, Nail Trim, Ear Cleaning, and optional wellness add-ons.' },
      { q: 'Can I reschedule my appointment?', a: 'Yes, appointments can be rescheduled up to 24 hours before your slot through your Account Appointments section.' },
      { q: 'What should I bring to the grooming session?', a: 'Bring your pet with a leash or carrier, updated vaccination details, and any grooming preferences you have.' },
    ]
  },
  {
    id: 'returns', label: 'Returns & Refunds', icon: 'assignment_return',
    items: [
      { q: 'What is your return policy?', a: 'Unused items in original packaging can be returned within 7 days of delivery, subject to inspection.' },
      { q: 'How do I initiate a return?', a: 'Submit a return request from your order history or contact support with photos and reason for return.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 3–7 business days after your return is approved and item quality is verified.' },
    ]
  },
  {
    id: 'payments', label: 'Payments', icon: 'credit_card',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept major credit/debit cards, select e-wallets, and cash on delivery for eligible locations.' },
      { q: 'How do loyalty points work?', a: 'You earn points with every purchase. Every 10 points gives you a ₱50 discount redeemable at checkout.' },
      { q: 'Why was my payment declined?', a: 'Declines can happen due to insufficient funds, expired card, or bank security flags. Try another method or contact your bank.' },
    ]
  },
  {
    id: 'account', label: 'Account & Profile', icon: 'manage_accounts',
    items: [
      { q: 'How do I change my password?', a: 'Go to Profile → Change Password, enter your new password twice, and click Update Password.' },
      { q: 'How do I update my profile photo?', a: 'Click the camera icon on your profile avatar, upload a new photo, and click Save.' },
      { q: 'Can I add multiple delivery addresses?', a: 'Yes. Go to Profile → Addresses and click Add New to save multiple addresses and set a default.' },
    ]
  },
];

function HelpSupportView() {
  const { user } = useAboutPresenter();
  const [activeCategory, setActiveCategory] = useState('orders');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: user?.email || '', topic: '', message: '' });

  const currentSection = useMemo(() => {
    const base = FAQ_DATA.find(s => s.id === activeCategory);
    if (!base) return null;
    if (!searchTerm.trim()) return base;
    return {
      ...base,
      items: base.items.filter(i =>
        i.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }, [activeCategory, searchTerm]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3000);
    setForm({ name: '', email: '', topic: '', message: '' });
  };

  return (
    <div className="min-h-screen ambient-bg font-display text-slate-900">
      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center py-16 bg-gradient-to-br from-[#1B3C53] to-[#2d5a7a] rounded-3xl text-white mb-12 px-8">
          <span className="material-symbols-outlined text-5xl mb-4 block text-orange-300">support_agent</span>
          <h1 className="text-5xl font-black mb-3">Help & Support</h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">Find answers to common questions or reach out to our team.</p>
          <div className="relative max-w-lg mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {FAQ_DATA.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1B3C53] text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Accordion */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Frequently Asked Questions</h2>
            {currentSection && currentSection.items.length > 0 ? (
              currentSection.items.map((item, i) => {
                const id = `${currentSection.id}-${i}`;
                const isOpen = expandedId === id;
                return (
                  <div key={id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedId(isOpen ? null : id)}
                      className="w-full flex justify-between items-center p-5 text-left"
                    >
                      <span className="font-bold text-slate-800 pr-4">{item.q}</span>
                      <span className={`material-symbols-outlined text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                <p className="text-slate-400 mt-2 font-bold">No results found for that search.</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-black text-slate-800 mb-1">Contact Support</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Send us a message</p>

              {formSent ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                  <p className="font-bold text-slate-800 mt-2">Message Sent!</p>
                  <p className="text-sm text-slate-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Your Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mt-1" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mt-1" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Topic</label>
                    <input required value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mt-1" placeholder="What's your concern?" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
                    <textarea required rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mt-1 resize-none" placeholder="Describe your issue in detail..." />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#1B3C53] text-white font-bold rounded-xl hover:bg-primary transition-colors">
                    Send Message
                  </button>
                </form>
              )}

              {/* Support Hours */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Support Hours</p>
                <div className="space-y-2 text-sm">
                  {[['Mon – Fri', '8:00 AM – 8:00 PM'], ['Saturday', '9:00 AM – 6:00 PM'], ['Sunday', '10:00 AM – 4:00 PM']].map(([day, hrs]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-slate-500">{day}</span>
                      <span className="font-bold text-slate-700">{hrs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HelpSupportView;
