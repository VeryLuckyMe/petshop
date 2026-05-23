import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../src/supabaseClient';

function AddressManagementView({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state_province: '',
    postal_code: '',
    label: 'Home',
    is_default: false
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAddresses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    // If setting as default, we must unset other defaults first (for this user)
    if (form.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const payload = {
      user_id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      address_line_1: form.address_line_1,
      address_line_2: form.address_line_2,
      city: form.city,
      state_province: form.state_province,
      postal_code: form.postal_code,
      label: form.label,
      is_default: form.is_default
    };

    if (editingId) {
      await supabase.from('addresses').update(payload).eq('id', editingId);
    } else {
      // if first address, make it default
      if (addresses.length === 0) payload.is_default = true;
      await supabase.from('addresses').insert(payload);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({
      full_name: '', phone: '', address_line_1: '', address_line_2: '',
      city: '', state_province: '', postal_code: '', label: 'Home', is_default: false
    });
    fetchAddresses();
  };

  const handleEdit = (address) => {
    setForm({ ...address });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await supabase.from('addresses').delete().eq('id', id);
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    fetchAddresses();
  };

  if (loading) {
    return <div className="py-10 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
  }

  if (showForm) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Address Line 1</label>
            <input required value={form.address_line_1} onChange={e => setForm({...form, address_line_1: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Street, House No." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Address Line 2 (Optional)</label>
            <input value={form.address_line_2} onChange={e => setForm({...form, address_line_2: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Apartment, Suite, Unit etc." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">City</label>
              <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">State/Province</label>
              <input required value={form.state_province} onChange={e => setForm({...form, state_province: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Postal Code</label>
              <input required value={form.postal_code} onChange={e => setForm({...form, postal_code: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={form.label === 'Home'} onChange={() => setForm({...form, label: 'Home'})} name="label" className="text-primary focus:ring-primary" />
                <span className="font-bold text-sm text-slate-700">Home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={form.label === 'Work'} onChange={() => setForm({...form, label: 'Work'})} name="label" className="text-primary focus:ring-primary" />
                <span className="font-bold text-sm text-slate-700">Work</span>
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={e => setForm({...form, is_default: e.target.checked})} className="rounded text-primary focus:ring-primary" />
              <span className="font-bold text-sm text-slate-700">Set as Default Address</span>
            </label>
          </div>
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-orange-600">Save Address</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-slate-800">My Addresses</h3>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div key={address.id} className={`p-5 rounded-2xl border ${address.is_default ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">{address.label || 'Other'}</span>
                  {address.is_default && <span className="text-primary text-xs font-bold uppercase tracking-widest">Default</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(address)} className="text-slate-400 hover:text-slate-700"><span className="material-symbols-outlined text-sm">edit</span></button>
                  <button onClick={() => handleDelete(address.id)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                </div>
              </div>
              <h4 className="font-bold text-slate-800 text-lg">{address.full_name}</h4>
              <p className="text-slate-500 text-sm mb-1">{address.phone}</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {address.address_line_1} {address.address_line_2 && `, ${address.address_line_2}`}<br/>
                {address.city}, {address.state_province} {address.postal_code}
              </p>
              {!address.is_default && (
                <button onClick={() => handleSetDefault(address.id)} className="mt-3 text-xs font-bold text-primary hover:underline">
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressManagementView;
