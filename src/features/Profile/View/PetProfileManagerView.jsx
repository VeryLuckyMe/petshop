import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../src/supabaseClient';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Other'];
const PET_ICONS = { Dog: '🐶', Cat: '🐱', Bird: '🐦', Rabbit: '🐰', Fish: '🐠', Hamster: '🐹', Other: '🐾' };

function PetProfileManagerView({ user }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', type: 'Dog', breed: '', age: '', weight: '',
    birthday: '', gender: 'Male', notes: ''
  });

  const fetchPets = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setPets(data);
    setLoading(false);
  };

  useEffect(() => { fetchPets(); }, [user]);

  const resetForm = () => {
    setForm({ name: '', type: 'Dog', breed: '', age: '', weight: '', birthday: '', gender: 'Male', notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    const payload = { ...form, user_id: user.id, age: form.age ? parseInt(form.age) : null, weight: form.weight ? parseFloat(form.weight) : null };
    if (editingId) {
      await supabase.from('pets').update(payload).eq('id', editingId);
    } else {
      await supabase.from('pets').insert(payload);
    }
    resetForm();
    fetchPets();
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name || '', type: pet.type || 'Dog', breed: pet.breed || '',
      age: pet.age || '', weight: pet.weight || '', birthday: pet.birthday || '',
      gender: pet.gender || 'Male', notes: pet.notes || ''
    });
    setEditingId(pet.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this pet?')) return;
    await supabase.from('pets').delete().eq('id', id);
    fetchPets();
  };

  if (loading) return <div className="py-10 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;

  if (showForm) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Pet' : 'Add a New Pet'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Pet Name *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="e.g. Max" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Type *</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {PET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Breed</label>
              <input value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="e.g. Shih Tzu" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Age (yrs)</label>
              <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="2" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="5.5" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Birthday</label>
              <input type="date" value={form.birthday} onChange={e => setForm({...form, birthday: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Notes (Health, Allergies, etc.)</label>
            <textarea rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Any special care instructions..." />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={resetForm} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-orange-600">Save Pet</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl text-slate-800">My Pets</h3>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span> Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-5xl mb-3">🐾</p>
          <p className="font-bold text-slate-700">No pets added yet</p>
          <p className="text-slate-400 text-sm">Add your furry friends to track their info!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map(pet => (
            <div key={pet.id} className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{PET_ICONS[pet.type] || '🐾'}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">{pet.name}</h4>
                    <p className="text-orange-500 text-sm font-bold">{pet.type}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(pet)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-sm">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDelete(pet.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-4">
                {pet.age && (
                  <div className="bg-white rounded-xl p-2 border border-orange-100">
                    <p className="text-xs text-slate-400 font-bold">AGE</p>
                    <p className="font-black text-slate-700">{pet.age} yrs</p>
                  </div>
                )}
                {pet.weight && (
                  <div className="bg-white rounded-xl p-2 border border-orange-100">
                    <p className="text-xs text-slate-400 font-bold">WEIGHT</p>
                    <p className="font-black text-slate-700">{pet.weight} kg</p>
                  </div>
                )}
                {pet.gender && (
                  <div className="bg-white rounded-xl p-2 border border-orange-100">
                    <p className="text-xs text-slate-400 font-bold">GENDER</p>
                    <p className="font-black text-slate-700">{pet.gender}</p>
                  </div>
                )}
              </div>
              {pet.notes && <p className="mt-3 text-sm text-slate-500 bg-white/60 p-3 rounded-xl">{pet.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetProfileManagerView;
