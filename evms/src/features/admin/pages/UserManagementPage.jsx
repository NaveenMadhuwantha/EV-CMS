import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../shared/layouts/AdminLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllUsers, addUser, deleteUser } from '../../../firestore/userDb';
import { Loader2, Trash2 } from 'lucide-react';

const UserFormModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050c14]/90 backdrop-blur-xl animate-fade-in font-inter">
       <div className="bg-[#0a2038] border-2 border-dashed border-[#00d2b4]/20 rounded-[48px] p-12 w-full max-w-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Add New Administrative Member</h3>
             <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-[#4E7A96] hover:text-white transition-all">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Full Identity Name</label>
                <input 
                   type="text" 
                   required
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold uppercase tracking-tight" 
                />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Email Address</label>
                <input 
                   type="email" 
                   required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[16px] focus:outline-none focus:border-[#00d2b4] transition-all font-bold placeholder:opacity-20 lowercase" 
                />
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Access Role</label>
                   <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                   >
                      <option value="ADMIN">ADMINISTRATOR</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="PROVIDER">PROVIDER</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#4E7A96] ml-2">Account Status</label>
                   <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-[14px] focus:outline-none focus:border-[#00d2b4] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                   >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                   </select>
                </div>
             </div>

             <div className="flex gap-6 pt-6 font-manrope">
                <button type="button" onClick={onClose} className="flex-1 py-5 rounded-3xl bg-white/[0.03] text-[#4E7A96] font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">TERMINATE</button>
                <button 
                   type="submit" 
                   disabled={loading}
                   className="flex-[2] py-5 rounded-3xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                   {loading ? 'PROCESSING...' : 'AUTHORIZE ACCOUNT'}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await addUser(userData);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert("Failed to add user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <AdminLayout title="Users">
      <div className="flex justify-between items-center mb-12">
        <PageHeader title="Users" subtitle="Manage user accounts and details." />
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00d2b4] to-blue-500 text-[#050c14] text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#00d2b4]/20"
        >
          Add Admin / User
        </button>
      </div>

      <div className="bg-[#0a2038]/40 border-2 border-dashed border-[#00d2b4]/10 rounded-[40px] overflow-hidden shadow-2xl font-inter">
        {loading ? (
          <div className="py-20 text-center opacity-30">
             <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">Synchronizing User Network...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">User Identity</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60">Status</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#4E7A96] uppercase tracking-[3px] opacity-60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length > 0 ? users.map((u, i) => (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-12 py-8 font-manrope">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#0f2040] border border-white/5 flex items-center justify-center font-extrabold text-[#00d2b4] shadow-inner text-lg">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div className="text-white font-extrabold text-[17px] uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{u.name}</div>
                            <div className="text-[10px] font-bold text-[#4E7A96] uppercase tracking-widest mt-1.5 opacity-60 font-inter">{u.email} — {u.role || 'MEMBER'}</div>
                        </div>
                      </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-inter ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400' : 'bg-red-500/10 border-red-500/10 text-red-400'}`}>
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-[#4E7A96] hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="3" className="px-12 py-20 text-center opacity-30">
                      <p className="text-[10px] font-bold uppercase tracking-[4px]">No Administrative Records Found</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <UserFormModal onClose={() => setShowModal(false)} onSubmit={handleAddUser} />}
    </AdminLayout>
  );
};
