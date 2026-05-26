import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Skeleton from "../components/Skeleton";
import Modal from "../components/Modal";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Search, 
  ShieldAlert, 
  ExternalLink,
  Eye,
  Check,
  X,
  UserCheck,
  Download
} from "lucide-react";

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  // Filters
  const [complaintSearch, setComplaintSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints" or "users"

  // Modal / Drawer Detail View
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Confirm actions states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "complaint" or "user"

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const response = await api.get("complaints/");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints for admin:", error);
      showToast("Failed to fetch complaints queue", "error");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get("users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users list:", error);
      showToast("Failed to fetch administrative users registry", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  // 1. Direct status change dropdown patches
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    const previousComplaints = [...complaints];
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    
    try {
      await api.patch(`complaints/${id}/update_status/`, { status: newStatus });
      showToast(`Complaint #${id} updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Failed to patch status:", error);
      showToast("Failed to update status on server", "error");
      // Rollback on error
      setComplaints(previousComplaints);
    }
  };

  // 2. Safely trigger deletes
  const triggerDelete = (id, type) => {
    setDeleteTargetId(id);
    setDeleteType(type);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      if (deleteType === "complaint") {
        await api.delete(`complaints/${deleteTargetId}/`);
        setComplaints(prev => prev.filter(c => c.id !== deleteTargetId));
        showToast("Complaint deleted successfully", "success");
        if (selectedComplaint?.id === deleteTargetId) {
          setSelectedComplaint(null);
        }
      } else if (deleteType === "user") {
        await api.delete(`users/${deleteTargetId}/`);
        setUsers(prev => prev.filter(u => u.id !== deleteTargetId));
        showToast("User deleted from registry", "success");
      }
    } catch (error) {
      console.error(`Deletion failed for ${deleteType}:`, error);
      showToast(`Failed to delete ${deleteType}`, "error");
    } finally {
      setDeleteTargetId(null);
      setDeleteType("");
    }
  };

  // 3. User staff toggle patch updates
  const handleRoleToggle = async (userId, currentIsStaff) => {
    // Prevent admin from removing their own staff privilege
    if (userId === currentUser?.userId) {
      showToast("You cannot revoke your own admin rights", "warning");
      return;
    }

    const nextIsStaff = !currentIsStaff;
    try {
      await api.patch(`users/${userId}/`, { is_staff: nextIsStaff });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_staff: nextIsStaff } : u));
      showToast(`User privileges updated successfully`, "success");
    } catch (error) {
      console.error("Failed to toggle user role:", error);
      showToast("Failed to alter user role", "error");
    }
  };

  // CSV Triage report exporter
  const handleExportCSV = () => {
    if (complaints.length === 0) {
      showToast("No complaints to export", "warning");
      return;
    }

    const headers = ["ID", "Title", "Category", "Description", "Status", "Created Date", "Author ID"];

    const rows = complaints.map((c) => {
      const rawDesc = c.description || "";
      const categoryRegex = /^\[Category:\s*([^\]]+)\]\n\n([\s\S]*)$/;
      const match = rawDesc.match(categoryRegex);
      const cat = match ? match[1] : "Other";
      const desc = match ? match[2] : rawDesc;

      const escapedTitle = `"${c.title.replace(/"/g, '""')}"`;
      const escapedDesc = `"${desc.replace(/"/g, '""')}"`;
      const escapedCat = `"${cat.replace(/"/g, '""')}"`;
      const escapedStatus = `"${c.status.replace(/"/g, '""')}"`;
      const formattedDate = `"${new Date(c.created_at).toLocaleString()}"`;

      return [c.id, escapedTitle, escapedCat, escapedDesc, escapedStatus, formattedDate, c.created_by];
    });

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ResolveFlow_Complaint_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV report exported successfully!", "success");
  };

  // Math metrics calculations
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
  const activeUsersCount = users.length;

  // Filter complaints
  const filteredComplaints = complaints.filter(c => 
    c.title.toLowerCase().includes(complaintSearch.toLowerCase()) || 
    c.description.toLowerCase().includes(complaintSearch.toLowerCase())
  );

  // Filter users
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Admin Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Perform case reviews, audit institution statuses, and manage registry accounts.
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-102 cursor-pointer shrink-0"
        >
          <Download className="w-4.5 h-4.5" />
          Export CSV Report
        </button>
      </div>

      {/* 1. Analytics Summary Metrics Row */}
      {loadingComplaints || loadingUsers ? (
        <Skeleton.OverviewSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Grievances</span>
              <span className="text-3xl font-black text-slate-900">{totalComplaints}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Triage Pending</span>
              <span className="text-3xl font-black text-slate-900">{pendingComplaints}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Tickets</span>
              <span className="text-3xl font-black text-slate-900">{resolvedComplaints}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
              <span className="text-3xl font-black text-slate-900">{activeUsersCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Triage / Management Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "complaints"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Triage Management ({filteredComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          User Accounts Registry ({filteredUsers.length})
        </button>
      </div>

      {/* Tab 1: Complaints management grid table */}
      {activeTab === "complaints" && (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search case titles, details, or authors..."
              value={complaintSearch}
              onChange={(e) => setComplaintSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl border glass-input text-sm text-slate-800"
            />
          </div>

          {/* Table */}
          {loadingComplaints ? (
            <Skeleton.TableSkeleton />
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm glass-panel">
              No complaint records found matching that query.
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Title / Info</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4">Status Triage</th>
                    <th className="px-6 py-4">Author ID</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      {/* Title */}
                      <td className="px-6 py-4 font-medium text-slate-900 max-w-xs">
                        <p className="font-bold truncate text-sm">{c.title}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate">{c.description}</p>
                      </td>
                      {/* Date */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">
                        {new Date(c.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className="text-xs font-bold rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          
                          <StatusBadge status={c.status} />
                        </div>
                      </td>
                      {/* Author */}
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        Reporter #{c.created_by || "System"}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition-all duration-150 cursor-pointer"
                            title="Quick Inspect"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Safe delete */}
                          <button
                            onClick={() => triggerDelete(c.id, "complaint")}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all duration-150 cursor-pointer"
                            title="Delete Complaint"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User management grid table */}
      {activeTab === "users" && (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users registry by username..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl border glass-input text-sm text-slate-800"
            />
          </div>

          {/* Table */}
          {loadingUsers ? (
            <Skeleton.TableSkeleton />
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm glass-panel">
              No user accounts found matching that username search query.
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-500">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4">Privilege Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      {/* ID */}
                      <td className="px-6 py-4 font-bold text-slate-500">#{u.id}</td>
                      {/* Username */}
                      <td className="px-6 py-4 font-bold text-slate-900">{u.username}</td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          u.is_active 
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
                            : "bg-slate-50 border border-slate-200 text-slate-600"
                        }`}>
                          {u.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      {/* Role Toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRoleToggle(u.id, u.is_staff)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            u.is_staff 
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" 
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title="Click to toggle Admin privilege"
                        >
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          {u.is_staff ? "System Admin" : "Standard Reporter"}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => triggerDelete(u.id, "user")}
                          disabled={u.id === currentUser?.userId}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all duration-150 cursor-pointer disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Action Overlay: Inspect Drawer Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedComplaint(null)}
          />
          {/* Slider Drawer */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-up glass-panel">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Inspection drawer</span>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedComplaint.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <StatusBadge status={selectedComplaint.status} />
                  <span className="text-xs font-bold text-slate-400">
                    Created at {new Date(selectedComplaint.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report details</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-1">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Image Preview */}
              {selectedComplaint.image && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grievance attachment</h4>
                  <div className="mt-1 border border-slate-100 rounded-2xl overflow-hidden shadow-sm aspect-video relative bg-slate-50">
                    <img
                      src={selectedComplaint.image}
                      alt="Complaint attachment"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={selectedComplaint.image}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-xl bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition-all shadow"
                    >
                      Inspect Photo
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom drawer triage triggers */}
            <div className="border-t border-slate-100 pt-6 mt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Triage Status:</span>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => {
                    handleStatusChange(selectedComplaint.id, e.target.value);
                    setSelectedComplaint(prev => ({ ...prev, status: e.target.value }));
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close Drawer
                </button>
                <button
                  onClick={() => triggerDelete(selectedComplaint.id, "complaint")}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 shadow-md shadow-rose-200 cursor-pointer"
                >
                  Delete Grievance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Double Confirm Modal Trigger */}
      <Modal
        isOpen={deleteConfirmOpen}
        title={deleteType === "complaint" ? "Delete Grievance Audit" : "Delete User Account"}
        message={
          deleteType === "complaint"
            ? "Are you absolutely sure you want to delete this complaint? This will remove all description entries and attached support images permanently from the database. This action is irreversible."
            : "Are you sure you want to delete this user from the system? They will instantly lose access to ResolveFlow, and all associated complaints will be archived. This action is irreversible."
        }
        confirmText={deleteType === "complaint" ? "Yes, Delete Case" : "Yes, Delete User"}
        cancelText="Cancel Action"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
