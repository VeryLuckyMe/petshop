import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { supabase } from '../../../../src/supabaseClient';

function AdminDashboardView() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals / Form States
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ username: '', role: 'user', loyalty_points: 0 });
  
  const [editingApptId, setEditingApptId] = useState(null);
  const [editApptStatus, setEditApptStatus] = useState('pending');

  // Product Add/Edit States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Dog',
    price: '',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      await Promise.all([
        fetchUsers(),
        fetchAppointments(),
        fetchProducts(),
        fetchOrders(),
        fetchReviews()
      ]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('zootopiaDatabase').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (data) setAppointments(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  // User handlers
  const startEditUser = (u) => {
    setEditingUserId(u.id);
    setEditUserForm({ username: u.username || '', role: u.role || 'user', loyalty_points: u.loyalty_points || 0 });
  };

  const handleUpdateUser = async (id) => {
    try {
      const { error } = await supabase.from('zootopiaDatabase').update({
        username: editUserForm.username,
        role: editUserForm.role,
        loyalty_points: parseInt(editUserForm.loyalty_points, 10) || 0,
      }).eq('id', id);
      if (error) throw error;
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user profile? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('zootopiaDatabase').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user: ' + err.message);
    }
  };

  // Appointment handlers
  const handleUpdateAppt = async (id, status) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      setEditingApptId(null);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update appointment:', err);
      alert('Failed to update appointment: ' + err.message);
    }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      fetchAppointments();
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      alert('Failed to delete appointment: ' + err.message);
    }
  };

  // Product handlers
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({ name: '', category: 'Dog', price: '', image_url: '', description: '' });
    setShowProductModal(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Dog',
      price: prod.price || '',
      image_url: prod.image_url || '',
      description: prod.description || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price) || 0,
      image_url: productForm.image_url,
      description: productForm.description
    };

    try {
      if (editingProductId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProductId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Remove this product from the store?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Order Shipping status handlers
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status: ' + err.message);
    }
  };

  // Reviews handlers
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this user review?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review: ' + err.message);
    }
  };

  const pendingAppts = appointments.filter(a => a.status === 'pending').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'packed' || o.status === 'shipped').length;

  const TABS = [
    { id: 'users', label: 'Users', icon: 'group' },
    { id: 'appointments', label: 'Appointments', icon: 'event' },
    { id: 'products', label: 'Products Inventory', icon: 'inventory_2' },
    { id: 'orders', label: 'Orders & Shipping', icon: 'local_shipping' },
    { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen ambient-bg font-display text-slate-900 bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-3xl text-primary text-orange-500">admin_panel_settings</span>
              <h1 className="text-4xl font-black text-slate-800">Admin Command Center</h1>
            </div>
            <p className="text-slate-500">Manage client profiles, bookings, products database, and order shipments.</p>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={openAddProductModal}
              className="px-5 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add New Product
            </button>
          )}
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Clients', value: users.length, icon: 'group', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { label: 'Care Bookings', value: appointments.length, icon: 'event', color: 'bg-orange-50 text-orange-600 border-orange-100' },
            { label: 'Products Catalog', value: products.length, icon: 'pets', color: 'bg-green-50 text-green-600 border-green-100' },
            { label: 'Pending Shipments', value: pendingOrders, icon: 'local_shipping', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            { label: 'User Reviews', value: reviews.length, icon: 'rate_review', color: 'bg-purple-50 text-purple-600 border-purple-100' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color} border`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">User Profiles</h2>
              <p className="text-sm text-slate-400">Moderator credentials, loyalty configurations, and roles management.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Client Username</th>
                    <th className="px-6 py-4 text-left">Email Address</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Loyalty Balance</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold">No registered users found.</td></tr>
                  ) : users.map(u => {
                    const uid = u.id;
                    const isEditing = editingUserId === uid;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input value={editUserForm.username} onChange={e => setEditUserForm({...editUserForm, username: e.target.value})}
                              className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-32 focus:border-orange-500 focus:outline-none" />
                          ) : (
                            <span className="font-bold text-slate-800">{u.username || '—'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{u.email || '—'}</td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select value={editUserForm.role} onChange={e => setEditUserForm({...editUserForm, role: e.target.value})}
                              className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none">
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'}`}>
                              {u.role || 'user'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <input type="number" value={editUserForm.loyalty_points} onChange={e => setEditUserForm({...editUserForm, loyalty_points: e.target.value})}
                              className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm w-20 focus:border-orange-500 focus:outline-none" />
                          ) : (
                            <span className="font-bold text-orange-500">{u.loyalty_points || 0} pts</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateUser(uid)} className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600">Save</button>
                              <button onClick={() => setEditingUserId(null)} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => startEditUser(u)} className="text-slate-400 hover:text-slate-700">
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button onClick={() => handleDeleteUser(uid)} className="text-slate-400 hover:text-red-500">
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── APPOINTMENTS TAB ── */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Care Center Bookings</h2>
              <p className="text-sm text-slate-400">Accept, update, or cancel veterinary and pet grooming appointments.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Service Package</th>
                    <th className="px-6 py-4 text-left">Client Email</th>
                    <th className="px-6 py-4 text-left">Booking Slot</th>
                    <th className="px-6 py-4 text-left">Pet Details</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-400 font-bold">No appointments found.</td></tr>
                  ) : appointments.map(appt => (
                    <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 max-w-xs">
                        <p className="text-sm font-black">{appt.service_name}</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">Method: {appt.payment_method || 'Cash'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-bold">{appt.user_email}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        <span className="font-bold text-slate-700">{appt.date}</span> at <span className="text-orange-500 font-bold">{appt.time}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        <span className="font-bold">{appt.pet_name || 'Quick Pet'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          appt.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                          appt.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          appt.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>{appt.status || 'pending'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateAppt(appt.id, 'confirmed')}
                              className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 shadow-sm"
                              title="Accept Appointment"
                            >
                              <span className="material-symbols-outlined text-[14px]">done</span> Accept
                            </button>
                          )}
                          <div className="relative">
                            <select
                              value={appt.status}
                              onChange={(e) => handleUpdateAppt(appt.id, e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none bg-slate-50 font-bold"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <button onClick={() => handleDeleteAppt(appt.id)} className="text-slate-300 hover:text-red-500 flex items-center">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTS CATALOG TAB (CRUD) ── */}
        {activeTab === 'products' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">pets</span>
                  <h3 className="text-xl font-bold text-slate-700">Products inventory is empty</h3>
                  <p className="text-slate-400">Click "Add New Product" to populate your catalog.</p>
                </div>
              ) : products.map(prod => (
                <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-48 w-full bg-slate-100 relative">
                      <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                        {prod.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-slate-800 text-lg line-clamp-1 mb-1">{prod.name}</h3>
                      <p className="text-sm text-slate-400 font-bold mb-3">ID: #{prod.id}</p>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{prod.description || 'No description provided.'}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-xl font-black text-orange-500">₱{prod.price}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="px-3.5 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="px-3 py-2 bg-red-50 text-red-500 font-bold text-xs rounded-xl hover:bg-red-100 transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS & SHIPPING TAB ── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Client Orders & Courier Shipments</h2>
              <p className="text-sm text-slate-400">Process shipping addresses, dispatch couriers, and track order fulfillment statuses.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Order Details</th>
                    <th className="px-6 py-4 text-left">Customer Email</th>
                    <th className="px-6 py-4 text-left">Fulfillment Address</th>
                    <th className="px-6 py-4 text-left">Total Value</th>
                    <th className="px-6 py-4 text-left">Shipping Status</th>
                    <th className="px-6 py-4 text-left">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-12 text-slate-400 font-bold">No orders processed yet. Try checking out on the mobile or web app!</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-400 font-bold">ID: #{order.id.slice(0, 8)}...</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        <div className="mt-2 space-y-1">
                          {order.items && JSON.parse(JSON.stringify(order.items)).map((itm, index) => (
                            <div key={index} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-5 h-5 bg-slate-100 rounded text-center flex items-center justify-center font-black text-[10px] text-slate-600">{itm.quantity}x</span>
                              <span className="truncate max-w-[120px]">{itm.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-bold">{order.user_email}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm max-w-xs">
                        <p className="truncate font-medium text-slate-800" title={order.shipping_address}>{order.shipping_address}</p>
                      </td>
                      <td className="px-6 py-4 text-orange-500 font-black text-sm">₱{order.total_amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          order.status === 'packed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>{order.status || 'pending'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'packed')}
                              className="px-2.5 py-1 bg-indigo-500 text-white text-[11px] font-bold rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                            >
                              Pack Items
                            </button>
                          )}
                          {order.status === 'packed' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              className="px-2.5 py-1 bg-blue-500 text-white text-[11px] font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                            >
                              Ship Order
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2.5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="px-2 py-1 border border-red-200 text-red-500 text-[11px] font-bold rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">User Product Reviews</h2>
              <p className="text-sm text-slate-400">Moderate comments, review feedback, and maintain appropriate store guidelines.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 text-left">Rating</th>
                    <th className="px-6 py-4 text-left">Product ID</th>
                    <th className="px-6 py-4 text-left">Reviewer</th>
                    <th className="px-6 py-4 text-left">Feedback Comment</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold">No product reviews recorded.</td></tr>
                  ) : reviews.map(rev => (
                    <tr key={rev.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-orange-500 font-black flex gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[16px] fill-current">star</span>
                          ))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm font-bold">#{rev.product_id}</td>
                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-bold text-sm">{rev.username}</p>
                        <p className="text-[11px] text-slate-400">{rev.user_email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm max-w-md">
                        <p className="line-clamp-2 leading-relaxed">{rev.comment}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteReview(rev.id)} className="text-slate-400 hover:text-red-500">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ── ADD/EDIT PRODUCT MODAL DIALOG ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-slate-200 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800">
                {editingProductId ? 'Edit Product Parameters' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Product Name</label>
                <input
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="e.g. Premium Kibble Formula"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Category</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-bold"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Fish">Fish</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Price (₱)</label>
                  <input
                    required
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-bold"
                    placeholder="₱ Price"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Image URL</label>
                <input
                  required
                  value={productForm.image_url}
                  onChange={e => setProductForm({...productForm, image_url: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs text-slate-600"
                  placeholder="Paste direct HTTPS image link"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Product Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none leading-relaxed text-sm"
                  placeholder="Detailed specifications, weight, target breed..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-md"
                >
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardView;
