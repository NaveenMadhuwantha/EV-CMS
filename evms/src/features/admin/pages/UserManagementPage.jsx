import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';
import { PageHeader } from '../components/AdminComponents';
import { getAllUsers, addUser, deleteUser, updateUserStatus } from '../../../firestore/userDb';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F172A]/40 backdrop-blur-md animate-fade-in font-inter">
       <div className="bg-white border-2 border-[#E2E8F0] rounded-[48px] p-12 w-full max-w-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2b4]/5 blur-[120px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-[#0F172A] uppercase tracking-tighter">Add New Administrative Member</h3>
             <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-all">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-2">Full Identity Name</label>
                 <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[16px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold uppercase tracking-tight" 
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-2">Email Address</label>
                 <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[16px] focus:outline-none focus:border-[#3B82F6] transition-all font-bold placeholder:text-[#94A3B8] lowercase" 
                 />
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-2">Access Role</label>
                    <select 
                       value={formData.role}
                       onChange={e => setFormData({...formData, role: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[14px] focus:outline-none focus:border-[#3B82F6] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                    >
                       <option value="ADMIN">ADMINISTRATOR</option>
                       <option value="MODERATOR">MODERATOR</option>
                       <option value="PROVIDER">PROVIDER</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-2">Account Status</label>
                    <select 
                       value={formData.status}
                       onChange={e => setFormData({...formData, status: e.target.value})}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-[#0F172A] text-[14px] focus:outline-none focus:border-[#3B82F6] transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                    >
                       <option value="ACTIVE">ACTIVE</option>
                       <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                 </div>
              </div>

              <div className="flex gap-6 pt-6 font-manrope">
                 <button type="button" onClick={onClose} className="flex-1 py-5 rounded-3xl bg-[#F8FAFC] text-[#64748B] font-black uppercase tracking-widest text-[11px] hover:bg-[#F1F5F9] transition-all">TERMINATE</button>
                 <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-5 rounded-3xl bg-gradient-to-r from-[#3B82F6] to-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                 >
                    {loading ? 'PROCESSING...' : 'AUTHORIZE ACCOUNT'}
                 </button>
              </div>
          </form>
       </div>
    </div>
  );
};

import { getAllProviderRequests, approveProviderRequest } from '../../../firestore/providerDb';
import { notificationDb } from '../../../firestore/notificationDb';
import { UserPlus, Clock, CheckCircle } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uData, rData] = await Promise.all([
        getAllUsers(),
        getAllProviderRequests()
      ]);
      setUsers(uData);
      setRequests(rData.filter(r => r.status === 'PENDING'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (req) => {
    if (window.confirm(`Approve provider status for ${req.name}?`)) {
       try {
          await approveProviderRequest(req.uid, req);
          alert("User promoted to Provider successfully!");
          fetchData();
       } catch (err) {
          console.error(err);
          alert("Approval failed.");
       }
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await addUser(userData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to add user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <DashboardLayout title="Users">
      {/* Requests Section */}
      {requests.length > 0 && (
        <div className="mb-12 animate-fade-down font-inter">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100"><Clock className="w-5 h-5" /></div>
              <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tighter">Pending Provider Applications <span className="ml-2 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black">{requests.length}</span></h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => (
                 <div key={req.id} className="bg-white border-2 border-[#E2E8F0] rounded-3xl p-6 hover:border-[#3B82F6]/30 transition-all group shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center font-black text-[#0F172A] text-xl shadow-inner border border-[#E2E8F0]">{req.name?.charAt(0)}</div>
                       <button onClick={() => handleApprove(req)} className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> APPROVE</button>
                    </div>
                    <div className="text-[#0F172A] font-black text-[16px] uppercase tracking-tight mb-1">{req.name}</div>
                    <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest mb-4">{req.email}</div>
                    <div className="pt-4 border-t border-[#E2E8F0] text-[9px] font-black text-[#94A3B8] uppercase tracking-[3px]">REQUESTED STATUS: PROVIDER</div>
                 </div>
              ))}
           </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-12">
        <PageHeader title="Users" subtitle="Manage user accounts and details." />
        <div className="flex gap-4">
           <button 
              onClick={() => {
                const msg = window.prompt("Enter broadcast message for all network users:");
                if (msg) {
                  notificationDb.send({
                    recipientId: 'all',
                    title: 'System Broadcast',
                    message: msg,
                    type: 'info',
                    actionUrl: '/dashboard'
                  }).then(() => alert("Broadcast sent successfully."));
                }
              }}
              className="px-6 py-4 rounded-2xl bg-white border border-[#E2E8F0] text-emerald-600 text-[12px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
            >
              BROADCAST
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-blue-600 text-white text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
            >
              Add Admin / User
            </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[40px] overflow-hidden shadow-xl font-inter">
        {loading ? (
          <div className="py-20 text-center text-[#64748B]">
             <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 opacity-30" />
             <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">Synchronizing User Network...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">User Identity</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px]">Status</th>
                <th className="px-12 py-8 text-[11px] font-bold text-[#64748B] uppercase tracking-[3px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {users.length > 0 ? users.map((u, i) => (
                <tr key={u.id} className="hover:bg-[#F8FAFC] transition-all group">
                  <td className="px-12 py-8 font-manrope">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#E0E7FF] border border-[#E2E8F0] flex items-center justify-center font-extrabold text-[#3B82F6] shadow-inner text-lg">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div className="text-[#0F172A] font-extrabold text-[17px] uppercase tracking-tight group-hover:text-[#3B82F6] transition-colors">{u.name}</div>
                            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1.5 font-inter">{u.email} — {u.role || 'MEMBER'}</div>
                        </div>
                      </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-inter ${u.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-12 py-8 text-right flex justify-end gap-3">
                    <button 
                       onClick={async () => {
                        const newStatus = u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
                        if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
                           await updateUserStatus(u.id, newStatus);
                           fetchData();
                        }
                      }}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                         u.status === 'SUSPENDED' 
                           ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' 
                           : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      {u.status === 'SUSPENDED' ? 'ACTIVATE' : 'SUSPEND'}
                    </button>
                    <button 
                       onClick={() => handleDelete(u.id)}
                       className="p-3 rounded-xl hover:bg-red-50 text-[#64748B] hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="3" className="px-12 py-20 text-center text-[#94A3B8]">
                      <p className="text-[10px] font-bold uppercase tracking-[4px]">No Administrative Records Found</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <UserFormModal onClose={() => setShowModal(false)} onSubmit={handleAddUser} />}
    </DashboardLayout>
  );
};
